// Package Imports
const bcrypt = require("bcryptjs");
const fcmNode = require("fcm-node")
const jwt = require("jsonwebtoken");
const { randomBytes, scrypt  } = require("crypto") ;
const  nodemailer = require("nodemailer");
// Local Imports
const { hash } = require("../utils/bcrypt");
const { sendEmail } = require("../utils/sendEmail");
const { sendEmailClient } = require("../utils/sendEmailClient");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const stripe = require('stripe')('sk_test_51MAwtwGUDX8FrEXLaAtaVxiO6LEWqahn1VIxEZf7sX7Y1eOqKPuwothbO5JQj0Z9n4Oyh4wLith3kNex4l7TSnTa00lS1LZ3D5');


const { fcm } = require("../utils/fcm");
const { ClientService,TeacherService,ParentService } = require("../services");
const { promisify } = require("util") ;

const _scrypt = promisify(scrypt);


const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = class {
  // Update Password
  static async updatePassword(req, res) {
    const { id, password } = req.body;
    // const hashedPassword = await hash(password);

    const salt = randomBytes(8).toString('hex');
    const hash = await _scrypt(password, salt, 32) ;
    const hashPassword = `${salt}.${hash.toString('hex')}`;

    const data = await ClientService.update(id, {
      password: hashPassword
    });
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.status(200).json({ success: true });
    }
  }
  static async sendNotification(req, res) {
    const { registrationToken, title,body,data } = req.body;
    const sendNotification = await fcm('',registrationToken,title,body,data,'admin');

    if (sendNotification) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed."  });
    } else {
      res.status(200).json({ success: true });
    }
  }
  static async sendEmail(req, res) {
    const { email, id,password,name } = req.body;
    const data = await ClientService.getById(id);
    const sendNotification = await sendEmailClient(email, 'ezpick credentials',name,id,data.result.mobile,'','');
    if (sendNotification) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed."  });
    } else {
      res.status(200).json({ success: true });
    }
  }
  // verifyToken
  static async verifyToken(req, res) {
    const { token }  = req.body;
    try {
      // Verify the token is valid
      const  user  = jwt.verify(token, process.env.JWT_SECRET);
      const data = await ClientService.getById(user.id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        return res.status(200).json({
          success: true,
          message: "Authorized",
          data: data.result,
        });
      }
    } catch (error) {
      return res.status(401).json({ error: "User Not Found Or Not Authorized" });
    }
  }
  // verifyUser
  static async verifyUser(req, res) {
    const { otp,email }  = req.body;
    try {
      // Verify the email is valid
      if (!email) {
        res
            .status(200)
            .json({ success: false, message: "Please provide an email." });
        return;
      }
      // Verify the id is valid
      if (!otp) {
        res
            .status(200)
            .json({ success: false, message: "Please provide an otp." });
        return;
      }
      const existingUserCheck = await ClientService.getByEmailAndOtp(email,otp);
      if (!existingUserCheck.error) {
        res.json({ success:true, message: "User Found." , client:existingUserCheck.result});
        return;
      }else {
        res.json({ success:false, message: "User Not Found or Invalid OTP" });
        return;
      }
    } catch (error) {
      return res.status(401).json({ error: "Request could not be processed." });
    }
  }
  // Login
  static async login(req, res) {
    const { email, password ,isSuperAdmin} = req.body;

    // Validate Email
    if (!email || email.trim() === "") {
      res
        .status(200)
        .json({ success: false, message: "Please provide an email." });
      return;
    }

    // Validate Password
    if (!password || password.trim() === "") {
      res
        .status(200)
        .json({ success: false, message: "Please provide an password." });
      return;
    }

    // Fetch user with the email
    const emailCheck = await ClientService.getByColumn("email", email);
    if (emailCheck.error) {
      res.status(200).json({
        success: false,
        message: "Looks like you haven't registered this Email yet...",
      });
      return;
    }

    const [result] = emailCheck.result;

    // Compare the passwords
    let login =false;
    if(isSuperAdmin){
      const [salt, storedHash] = password.split('.');
      const [salt1, storedHash1] = result.password.split('.');
      if(storedHash === storedHash1){
        login= true;
      }
    }else {
      const [salt, storedHash] = result.password.split('.');
      const hashed = await _scrypt(password, salt, 32) ;
      if ( storedHash === hashed.toString('hex')) {
        login= true;
      }
    }

    if (login!==true) {
      res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
      return;
    }
    console.log(result.deactivate)
    if (result.deactivate === false) {
      res.status(401).json({
        success: false,
        message: "Your Account is Deactivated",
      });
      return;
    }
    // Data to send as API response
    const response = {
      id: result.id,
      email: result.email,
      name: result.name,
      role:'CLIENT',
      status:result.status,
      subscription:result.subscriptionId,
      customerId:result.customerId,
      selectedGrades:result.selectedGrades,
    };

    // Generate JWT Token
    const token = jwt.sign(response, JWT_SECRET);

    // Final Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: response,
      token,
    });
  }

  // Get All
  static async getAll(_, res) {
    const data = await ClientService.getAll();
    if (data.error) {
      res
        .status(500)
        .json({ success: false, message: "Request could not be processed." });
    } else {
      res.json({ success: true, clients: data.result });
    }
  }

  // Get By Id
  static async getById(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await ClientService.getById(id);
      if (data.error) {
        res.status(200).json({ success: false, message: "Not found." });
      } else {
        res.status(200).json({ success: true, client: data.result });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }// update the subscription

  static async status(req, res) {
    const { clientId } = req.params;
    const { status } = req.query;

    const clientData = await ClientService.update(clientId, {      status: status    });
    const teacherData = await TeacherService.updateStatus(clientId, {      status: status    });
    const parentData = await ParentService.updateStatus(clientId, {      status: status    });

    if (clientData.error && teacherData.error && parentData.error ) {
      res
          .status(500)
          .json({ success: false, message: "Request could not be processed." });
    } else {
      res.json({ success: true });
    }
  }

  // Create
  static async create(req, res) {
    const { email, password,mobile,name, ...rest } = req.body;

    if (!email) {
      res
        .status(200)
        .json({ success: false, message: "Please provide an email." });
      return;
    }
    if (!mobile) {
      res
        .status(200)
        .json({ success: false, message: "Please provide an Mobile number." });
      return;
    }

    const existingUserCheck = await ClientService.getByEmail(email);
    if (!existingUserCheck.error) {
      var digits = '0123456789';
      let OTP = '';
      for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      const data = await ClientService.update(existingUserCheck.result.id, {
        otp: OTP
      });
      //send email
      try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "smtp-relay.sendinblue.com",
          port: 587,
          secure: false,
          auth: {
            user: 'ask@ezpick.co',
            pass: 'rRBQE8npvUVWhMfb',
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"EZPick" <ask@ezpick.co>',
          to: existingUserCheck.result.email,
          subject: "Account Verification Code ✔",
          html: `
                <style>
                    html,
                    body {
                        margin: 0 auto !important;
                        padding: 0 !important;
                        height: 100% !important;
                        width: 100% !important;
                        background: #f1f1f1;
                    }
                
                    /* What it does: Stops Outlook from adding extra spacing to tables. */
                    table,
                    td {
                        mso-table-lspace: 0pt !important;
                        mso-table-rspace: 0pt !important;
                    }
                
                    /* What it does: Fixes webkit padding issue. */
                    table {
                        border-spacing: 0 !important;
                        border-collapse: collapse !important;
                        table-layout: fixed !important;
                        margin: 0 auto !important;
                    }
                </style>
                
                <!-- CSS Reset : END -->
                <div style="width: 100%; margin: 0 auto; background-color: #2f4d33" align="center">
                    <div style="padding-top: 40px; padding-bottom: 40px">
                        <div style="
                          width: 93%;
                          margin: 0 auto;
                          padding-top: 0px;
                          background-color: #ffffff;
                          border-radius: 10px;
                          height: 90%;
                        ">
                            <!-- BEGIN BODY -->
                
                            <table width="100%" style="background-color: #ffffff" align="center">
                                <tr>
                                    <td>
                                        <table align="center">
                                            <tr>
                                                <td align="center">
                                                    <p style="
                                        color: #7f7f7f;
                                        font-family: Urbanist;
                                        font-size: 30px;
                                        font-style: normal;
                                        font-weight: 600;
                                        line-height: normal;
                                        letter-spacing: 1px;
                                        text-transform: capitalize;
                                        margin-top: 3%;
                                      ">
                                                        Verification
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="
                                         color: #808080;
                                          font-family: Urbanist;
                                          font-size: 18px;
                                          font-style: normal;
                                          font-weight: 400;
                                          line-height: normal;
                                          letter-spacing: 1.92px;
                                          text-transform: capitalize;
                                          margin: 0;">
                                                        We have received a request for account verification on our website. <br />To
                                                        proceed,
                                                        please use the following verification code.
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="
                                          color: #2f4d33;
                                          font-family: Urbanist;
                                          font-size: 22px;
                                          font-style: normal;
                                          font-weight: 600;
                                          line-height: normal;
                                          letter-spacing: 1.92px;
                                          text-transform: capitalize;
                                          margin: 0;
                                        ">
                                                        Verification Code:${OTP}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="
                                          color: #808080;
                                          font-family: Urbanist;
                                          font-size: 18px;
                                          font-style: normal;
                                          font-weight: 400;
                                          line-height: normal;
                                          letter-spacing: 1.92px;
                                          text-transform: capitalize;
                                          margin: 0;
                                        ">
                                                        If you did not initiate this verification process or request a password reset,
                                                        kindly disregard this email.<br /> Your account's security is important to us,
                                                        and
                                                        there is no need to take any further action.
                
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="
                                            color: #808080;
                                            font-family: Urbanist;
                                            font-size: 20px;
                                            font-style: normal;
                                            font-weight: 500;
                                            line-height: normal;
                                            letter-spacing: 1.92px;
                                            text-transform: capitalize;
                                            margin-top: 1%;
                                          ">
                                                        Thank you,
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <p style="
                                            color: #808080;
                                            font-family: Urbanist;
                                            font-size: 20px;
                                            font-style: normal;
                                            font-weight: 500;
                                            line-height: normal;
                                            letter-spacing: 1.92px;
                                            text-transform: capitalize;
                                            margin-top: 1%;
                                          ">
                                                        The Ezpick Team
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center">
                                                    <img src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1689679808272.png"
                                                        alt="" style="width: 20%; margin-bottom: 10%; margin-top: 2%" />
                                                </td>
                                            </tr>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        // Final teacher
        res.json({ success:false, message: "Email Already Registered." , client:existingUserCheck.result});
        return;
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred while sending the email.",
        });
      }
    }else {
      // Encryption
      const salt = randomBytes(8).toString('hex');
      const hash = await _scrypt(mobile, salt, 32) ;
      const hashPassword = `${salt}.${hash.toString('hex')}`;

      const data1 = await ClientService.create({
        password: hashPassword,
        email,
        mobile,
        name,
        ...rest,
      });
      try {
        const customer = await stripe.customers.create({
          email: email,
          name: name,
          shipping: {
            address: {
              city: '',
              country: '',
              line1: '',
              postal_code: '',
              state: '',
            },
            name: name,
          },
          address: {
            city: '',
            country: '',
            line1: '',
            postal_code: '',
            state: '',
          },
        });
         await ClientService.update(data1.result.id, {
           customerId: customer.id
        });
        // Log the created customer object for debugging
      } catch (error) {
        console.error("Error creating customer:", error);
      }

      if (data1.error) {
        res
            .status(500)
            .json({ success: false, message: "Request could not be processed." });
      } else {
        const data = await ClientService.getById(data1.result.id);
        if (data.error) {
          res.status(200).json({ success: false, message: "Not found." });
        } else {
          res.status(200).json({ success: true, client: data.result });
        }
      }
    }
  }

  // Update
  static async update(req, res) {
    const { id, password, ...rest } = req.body;

    if (id) {
      const data = await ClientService.update(id, { ...rest });
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res
        .status(200)
        .json({ success: false, message: "Please provide an ID." });
    }
  }

  // Delete
  static async delete(req, res) {
    const { id } = req.params;

    if (id) {
      const data = await ClientService.delete(id);
      if (data.error) {
        res.status(500).json({
          success: false,
          message: "Request could not be processed.",
        });
      } else {
        res.status(200).json({ success: true });
      }
    } else {
      res.status(200).json({ success: false, message: "Please provide an ID" });
    }
  }
  // paymentIntent
  static async paymentIntent(req, res) {
    try {
      const { amount, currency, paymentMethodId } = req.body;

      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethodId,
        confirm: true,
      });

      // Return the client secret to the client-side for confirmation
      res.json({ success: true,clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'An error occurred while processing the payment.' });
    }
  }
  // create-subscription
  static async createSubscription(req, res) {
    const { customerId , priceId,clientId  } = req.body;
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
      });
      if(subscription.id){
        await ClientService.update(clientId, {
          subscriptionId: subscription.id
        });
      }
      if (subscription.pending_setup_intent !== null) {
        res.send({
          type: 'setup',
          clientSecret: subscription.pending_setup_intent.client_secret,
        });
      } else {
        res.send({
          type: 'payment',
          clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
      }
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }

  }
  // create-subscription
  static async createFreeTrialSubscription(req, res) {
    const { customerId , priceId,clientId  } = req.body;
    try {
      const subscriptionData = {
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        trial_period_days: 14,
        // Set the exact end timestamp for the trial period
        expand: ['latest_invoice.payment_intent', 'pending_setup_intent'],
      };

      const subscription = await stripe.subscriptions.create(subscriptionData);

      if (subscription.id) {
        await ClientService.update(clientId, {
          subscriptionId: subscription.id,
        });
      }

      if (subscription.pending_setup_intent !== null) {
        res.send({
          type: 'setup',
          clientSecret: subscription.pending_setup_intent.client_secret,
        });
      } else {
        res.send({
          type: 'payment',
          clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
      }
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }

  }
  // cancelSubscription
  static async cancelSubscription(req, res) {
    const { subscriptionId  } = req.body;
    try {
      const subscription = await stripe.subscriptions.update(
          subscriptionId,
          {
            cancel_at_period_end: true,
          }
      );
      res.json({ success: true,subcription: subscription });
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  }
  // updateSubscriptionInvoice
  static async updateSubscriptionInvoice(req, res) {
    const { subscriptionId,priceId ,customerId  } = req.body;
    try {
      // Set proration date to this moment:
      const proration_date = Math.floor(Date.now() / 1000);

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // See what the next invoice would look like with a price switch
    // and proration set:
      const items = [{
        id: subscription.items.data[0].id,
        price: priceId, // Switch to new price
      }];

      const invoice = await stripe.invoices.retrieveUpcoming({
        customer: customerId,
        subscription: subscriptionId,
        subscription_items: items,
        subscription_proration_date: proration_date,
      });
      res.json({ success: true,invoice: invoice });
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  }
  // updateSubscription
  static async updateSubscription(req, res) {
    const { subscriptionId,priceId ,clientId,planId  } = req.body;
    try {
      // Set proration date to this moment:
      const proration_date = Math.floor(Date.now() / 1000);
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      stripe.subscriptions.update(
          subscriptionId,
          {
            items: [{
              id: subscription.items.data[0].id,
              price: priceId,
            }],
            proration_date: proration_date,
          }
      );
      const data = await ClientService.update(clientId, {
        planId: planId
      });

      res.json({ success: true,subscription: subscription });
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  }
  // billing
  static async billing(req, res) {
    const customerId = req.params.customerId;
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
      });
      res.json({ success: true,invoices: invoices });
    } catch (error) {
      return res.status(400).send({ error: { message: error.message } });
    }
  }
  // forgot Password check
  static async forgotPasswordCheck(req, res) {
    const { id } = req.body;
    // Validate Username
    if (!id) {
      res
          .status(200)
          .json({ success: false, message: "Please provide an Id." });
      return;
    }
    const user = await ClientService.getById(id);

    if (user.error) {
      res.status(200).json({ success: false ,message:'User not found'});
      return;
    }else {
      const client = user.result;
      const DATA = {
        forget: client?.forget,
        forgetAt: client?.forgetAt,
      };
      res
          .status(200)
          .json({ success: true, data: DATA });
    }
  }
  static async forgotPassword(req, res) {
    const {email} = req.body;
    if (email) {
      const data = await ClientService.getByColumn("email", email);
      if (data.error) {
        res.status(200).json({success: false, message: "Not found."});
      } else {
        // check email
        const Client = data.result[0];
        if (Client.email) {
          // Data to send as API parent
          const currentDate = new Date()
          const expiry = currentDate.setTime(currentDate.getTime() + (15 * 60 * 1000));
          const TOKEN_DATA = {
            id: Client.id,
            role: 'CLIENT',
            expiry
          };
          // Generate JWT Token
          const token = jwt.sign(TOKEN_DATA, JWT_SECRET);

          //send email

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: 'ask@ezpick.co', // generated ethereal user
              pass: 'rRBQE8npvUVWhMfb', // generated ethereal password
            },
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"EZPick" < ask@ezpick.co>', // sender address
            to: Client.email, // list of receivers
            subject: "Forgot Password ✔", // Subject line
            html: `
                    <style>
                     html,
                     body {
                     margin: 0 auto !important;
                     padding: 0 !important;
                     height: 100% !important;
                     width: 100% !important;
                     background: #f1f1f1;
                     }
                     /* What it does: Stops Outlook from adding extra spacing to tables. */
                     table,
                     td {
                     mso-table-lspace: 0pt !important;
                     mso-table-rspace: 0pt !important;
                     }
                     /* What it does: Fixes webkit padding issue. */
                     table {
                     border-spacing: 0 !important;
                     border-collapse: collapse !important;
                     table-layout: fixed !important;
                     margin: 0 auto !important;
                     }
                  </style>
                  <!-- CSS Reset : END -->
                  <div style="width: 100%;margin: 0 auto;background-color: #2f4d33;" align="center">
                     <div style="padding-top: 40px; padding-bottom: 40px;">
                        <div
                           style="width: 93%; margin: 0 auto; padding-top: 0px; background-color: #ffffff;border-radius: 10px;height: 90%;">
                           <!-- BEGIN BODY -->
                           <table width="100%" style="background-color: #ffffff; " align="center">
                           <tr>
                              <td>
                                 <!-- Nested table for background image -->
                                 <table
                                    align="center"
                                    >
                                    <tr style="">
                                       <td align="center">
                                          <!-- <img
                                             src=""
                                             alt=""
                                             width="700px"
                                             height="1px"
                                             /> -->
                                       </td>
                                    </tr>
                                    <tr style="margin: 0 auto">
                                       <td style="height: 30%; width: 100%" align="center">
                                          <!-- <img
                                             src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1689679900281.png"
                                             alt=""
                                             style="width: 50px;display: inline-block;margin-top:7%"
                                             /> -->
                                          <p style="display: inline-block; vertical-align: top;margin-top:65px"
                                             >
                                             <img
                                                src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1690107020703.png"
                                                alt=""
                                                style="width: 25%;"
                                                align="center"
                                                />
                                             <br />
                                             <span
                                                style="
                                                color: #2A7936;
                                                font-family: Urbanist;
                                                font-size: 28px;
                                                font-style: normal;
                                                font-weight: 600;
                                                line-height: normal;
                                                text-transform: uppercase;
                                                ;
                                                "
                                                >
                                             reset password
                                             </span>
                                          </p>
                                          <!-- <img
                                             src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1689679900281.png"
                                             alt=""
                                             style="width: 50px; display: inline-block;margin-top:5%"
                                             /> -->
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #2a7936;
                                             font-family: Urbanist;
                                             font-size: 25px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             letter-spacing: 2.64px;
                                             text-transform: capitalize;
                                             margin-top: 0px;
                                             "
                                             >
                                             Hi ${Client.name?Client.name:''},
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #000;
                                             font-family: Urbanist;
                                             font-size: 16px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             text-transform: uppercase;
                                             "
                                             >
                                             It seems you forgot your password!
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #878787;
                                             text-align: center;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 400;
                                             line-height: normal;
                                             letter-spacing: 1.68px;
                                             "
                                             >
                                             A request has been received to change the <br />
                                             password of your account.
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <button
                                             style="
                                             color: #fff;
                                             font-family: Urbanist;
                                             font-size: 23px;
                                             padding: 12px 20px 12px 20px;
                                             margin-top: 50px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             letter-spacing: 2.28px;
                                             text-transform: capitalize;
                                             border-radius: 25px;
                                             border: 0px solid;
                                             background: linear-gradient(
                                             51deg,
                                             rgba(42, 121, 54, 0.99) 0%,
                                             rgba(15, 176, 40, 0.99) 100%
                                             );
                                             ">
                                             <a style="color: white; text-decoration: none;" target="_blank" href="https://school.ezpick.co/reset-password?token=${token}">Reset Password</a>
                                          </button>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #8f8f8f;
                                             text-align: center;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 400;
                                             line-height: normal;
                                             letter-spacing: 1.74px;
                                             "
                                             >
                                             By clicking this link button, <br />
                                             you can reset your password.
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #888;
                                             font-family: Urbanist;
                                             font-size: 23px;
                                             font-style: normal;
                                             font-weight: 500;
                                             line-height: normal;
                                             letter-spacing: 1.92px;
                                             "
                                             >
                                             For any further queries, email us through this email
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #353cf4;
                                             font-family: Urbanist;
                                             font-size: 20px;
                                             font-style: normal;
                                             font-weight: 600;
                                             line-height: normal;
                                             letter-spacing: 1.16px;
                                             text-decoration-line: underline;
                                             "
                                             >
                                             ask@ezpick.com
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #808080;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 500;
                                             line-height: normal;
                                             letter-spacing: 1.92px;
                                             text-transform: capitalize;
                                             "
                                             >
                                             Thank you,
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <p
                                             style="
                                             color: #808080;
                                             font-family: Urbanist;
                                             font-size: 18px;
                                             font-style: normal;
                                             font-weight: 500;
                                             line-height: normal;
                                             letter-spacing: 1.92px;
                                             text-transform: capitalize;
                                             "
                                             >
                                             The Ezpick Team
                                          </p>
                                       </td>
                                    </tr>
                                    <tr>
                                       <td align="center">
                                          <img
                                             src="https://ezpick.s3.us-east-1.amazonaws.com/schools/1689679808272.png"
                                             alt=""
                                             style="width: 20%; margin-bottom: 10%;margin-top:2%"
                                             />
                                       </td>
                                    </tr>
                                    </td>
                                 </table>
                        </div>
                     </div>
                  </div>
`, // html body
          });

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
          const data = await ClientService.update(Client.id, {
            forgetAt: new Date().toLocaleString(),
            forget: false,
          });

          // Final parent
          res.status(200).json({
            success: true,
            message: "Email Sent successful",
          });
        } else {
          res
              .status(200)
              .json({success: false, message: "Email Not Found."});
        }
      }
    } else {
      res
          .status(200)
          .json({success: false, message: "Parent Not found"});
    }
  }
};
