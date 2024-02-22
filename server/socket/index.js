const { Server: SocketServer } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const jwt = require("jsonwebtoken");
const { fcm } = require("utils/fcm");
const { StudentService, RequestService,TeacherService,ParentService } = require("../../services");

module.exports.initiateSocket = (server) => {
  // Arrays to record which students and teachers are connected
  let connectedStudents = [];
  let connectedTeachers = [];
  let connectedClients = [];
  let connectedGuards = [];

  // add student
  const addStudent = (student) => {
    let itemIndex = -1;
    const existing = connectedStudents.find((s, index) => {
      if (s.studentId === student.studentId) {
        itemIndex = index;
        return true;
      } else return false;
    });

    if (!existing) connectedStudents.push(student);
    else connectedStudents[itemIndex].socketId = student.socketId;

    return student;
  };

  // add teacher
  const addTeacher = (teacher) => {
    let itemIndex = -1;
    const existing = connectedTeachers.find((s, index) => {
      if (s.teacherId === teacher.teacherId) {
        itemIndex = index;
        return true;
      } else return false;
    });

    if (!existing) connectedTeachers.push(teacher);
    else connectedTeachers[itemIndex].socketId = teacher.socketId;

    return teacher;
  };
  // add client
  const addClient = (client) => {
    let itemIndex = -1;
    const existing = connectedClients.find((s, index) => {
      if (s.clientId === client.clientId) {
        itemIndex = index;
        return true;
      } else return false;
    });

    if (!existing) connectedClients.push(client);
    else connectedClients[itemIndex].socketId = client.socketId;

    return client;
  };
  const addGuard = (guard) => {
    let itemIndex = -1;
    const existing = connectedGuards.find((s, index) => {
      if (s.guardId === guard.guardId) {
        itemIndex = index;
        return true;
      } else return false;
    });

    if (!existing) connectedGuards.push(guard);
    else connectedGuards[itemIndex].socketId = guard.socketId;

    return guard;
  };

  // instantiate socket server
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
    pingInterval: 30000,
    pingTimeout: 120000,
    cookie: false,
    transports: ["websocket", "polling"]
  });

  const pubClient = createClient({ url: 'redis://15.185.249.239:6379', password:'ezpickredis' });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    io.listen(5989);
  });

  // io.adapter(createAdapter(pubClient, subClient));

  //io.listen(3000);

  // This enables CORs and ensures that our frontend,
  // running on a different server can connect to our backend
  // io.set("origins", "*:*");

  // handle on connect event
  io.sockets.on("connection", async (socket) => {
    const { auth } = socket.handshake;
    if (!auth) {
      console.log("Unauthorized User connected: ");
      socket.disconnect();
      return;
    }

    const { token, role,aliasToken } = auth;
    if (!aliasToken) {
      if (!token) {
        console.log("Token not found");
        socket.disconnect();
        return;
      }
    }
    let id = null;

    try {
      if (aliasToken){
        const decoded = jwt.verify(aliasToken.trim(), process.env.JWT_SECRET);
        id = decoded.id;
      }else {
        const decoded = jwt.verify(token.trim(), process.env.JWT_SECRET);
        id = decoded.id;
      }
    } catch (e) {
      socket.disconnect();
      return;
    }

    if (!id) {
      console.log("Invalid Token: ", auth.token);
      socket.disconnect();
      return;
    }

    if (!role) {
      console.log("Invalid Role: ", role);
      socket.disconnect();
      return;
    }

    switch (role.toUpperCase()) {
      case "TEACHER": {
        teacherEvents(socket, { id }).then(() => {
          console.log("Teacher Events Attached");
        });
        break;
      }
      case "TEACHER_WEB": {
        teacherWebEvents(socket, { id }).then(() => {
          console.log("Teacher Events Attached");
        });
        break;
      }
      case "PARENT": {
        parentEvents(socket, { id }).then(() => {
          console.log("Parent Events Attached");
        });
        break;
      }
      case "CLIENT": {
        clientEvents(socket, { id }).then(() => {
          console.log("Client Events Attached");
        });
        break;
      }
      case "GUARD": {
        guardEvents(socket, { id }).then(() => {
          console.log("Guard Events Attached");
        });
        break;
      }
      default: {
        console.log("Invalid Role: ", role);
        socket.disconnect();
        return;
      }
    }
  });

  async function handleNewRequest({ parentId, studentId, gradeId, timestamp,clientId,pickUpGuardian,guardId }) {
    const { result: existing } =
        await RequestService.getTodayRequestByParentAndStudent(
            parentId,
            studentId
        );
    if (existing.length > 0) {

      const latest = existing.find(e => e.studentId===studentId)
      const { request } = await RequestService.update(latest.id, {
        requestTime: timestamp,
        pickUpGuardian:pickUpGuardian,
        parentId:parentId,
      });

      const {result: teachers} = await StudentService.getId(studentId);
      if (teachers) {
        teachers.map(async (item)=>{
          const connection = await connectedTeachers.find(
              (c) => c.teacherId === item.teacherId
          );
          if (connection) {
            const { socketId } = connection;
            io.emit("_new_request", request);
            const data = await TeacherService.getById(item.teacherId);
            if (data.result.deviceToken != null && data.result.deviceToken !=="") {
              const sendNotification = await fcm('',data.result.deviceToken,'Alert!', ' Request Again from '+request.student.name+' from '+request.student.grade.name+' parents Arrived',request.id,'request');
            }
          }
        })
      }
      if (clientId) {
        const connection = await connectedClients.find(
            (c) => c.clientId === clientId
        );

        if (connection) {
          const { socketId } = connection;

          io.emit("_new_request", request);
        }
      }
    } else {

      const requestTime = new Date(timestamp);
      const {  result : resultRequest} = await RequestService.create({
        parentId,
        studentId,
        gradeId,
        requestTime,
        clientId,
        pickUpGuardian,
        guardId
      });
      const requestId = resultRequest.id;
      const {result: teachers} = await StudentService.getId(studentId);
      if (teachers) {
        teachers.map(async (item)=>{
          const connection = await connectedTeachers.find(
              (c) => c.teacherId === item.teacherId
          );
          if (connection) {
            const { socketId } = connection;
            io.emit("_new_request", resultRequest);
            const data = await TeacherService.getById(item.teacherId);
            if (data.result.deviceToken != null && data.result.deviceToken !=="") {
              const sendNotification = await fcm('',data.result.deviceToken,'Alert!', 'New Request from '+resultRequest.student.name+' from '+resultRequest.student.grade.name+' parents Arrived',requestId,'request');
            }
          }
        })
      }
      if (clientId) {
        const connection = await connectedClients.find(
            (c) => c.clientId === clientId
        );

        if (connection) {
          const { socketId } = connection;

          io.emit("_new_request", resultRequest);
        }
      }
    }
  }

  async function handleRefreshRequest({ parentId,socketId}) {
    const result  = await RequestService.getTodayRequestsByParent(parentId);
    io.to(socketId).emit("_parent_requests", result);
  }
  async function handleRefreshRequestTeacher({ teacherId,socketId}) {
    const { result } = await RequestService.getTodayRequestsByTeacher(teacherId);

    io.to(socketId).emit("_teacher_requests", result);
  }

  async function handleConfirmRequest({ studentId, timestamp }) {

    const { result } = await RequestService.getLatestByStudent(studentId);
    if (result) {
      const {request} = await RequestService.update(result.id, {
        status: 2,
        confirmTime: timestamp,
      });
      const {result: teachers} = await StudentService.getId(studentId);
      if (teachers) {
        teachers.map(async (item)=>{
          const connection = await connectedTeachers.find(
              (c) => c.teacherId === item.teacherId
          );
          if (connection) {
            const { socketId } = connection;
            io.emit("_new_request", request);
            const data = await TeacherService.getById(item.teacherId);
            if (data.result.deviceToken != null && data.result.deviceToken !=="") {
              const sendNotification = await fcm('',data.result.deviceToken,'Alert!', 'Guardian received the kid has been confirmed.',result.id,'request');
            }
          }
        })
      }
      if (result.clientId) {
        const connection = await connectedClients.find(
            (c) => c.clientId === result.clientId
        );
        if (connection) {
          const {socketId} = connection;

          io.emit("_confirmed_request", request);
        }
      }
    }
  }
  async function handleTimeoutRequest({ studentId }) {
    const { result } = await RequestService.getLatestByStudent(studentId);
    if (result) {
      await RequestService.update(result.id, { status: 3 });
    }
  }
  async function handleApproveRequest({ requestId, timestamp }) {
    await RequestService.update(requestId, {
      status: 1,
      approveTime: timestamp,
    });

    const { result } = await RequestService.getById(requestId);

    // get connection for the student
    const connection = connectedStudents.find(
        (c) => c.studentId === result.studentId
    );

    // if (connection) {
    //   console.log("Found Connection");
    //   io.emit("_approved_request", {
    //     studentId: connection.studentId,
    //   });
    //   io.emit("_new_request", result);
    //   const data = await ParentService.getById(result.parentId);
    //   if (data.result.deviceToken != null) {
    //     const sendNotification = await fcm('',data.result.deviceToken, 'Alert!','Dear Guardian your pick up request for your kid has been approved. Your Kid is coming be ready to pick up!',requestId,'request');
    //   }
    //
    // } else {
    //   console.log("Connection Not Found", result.studentId, connectedStudents);
    // }
    console.log("Found Connection");
    io.emit("_approved_request", {
      studentId: result.studentId,
    });
    io.emit("_new_request", result);
    const data = await ParentService.getById(result.parentId);
    if (data.result.deviceToken != null && data.result.deviceToken !=="") {
      const sendNotification = await fcm('',data.result.deviceToken, 'Alert!','Dear Guardian your pick up request for your kid has been approved. Your Kid is coming be ready to pick up!',requestId,'request');
    }
  }

  async function parentEvents(socket, { id }) {
    const { result: students } = await StudentService.getIdsByParent(id);
    // if (students.length === 0) return;

    const connections = [];

    students.forEach((s) => {
      const connection = addStudent({
        studentId: s.studentId,
        socketId: socket.id,
      });
      connections.push(connection);
    });

    // handle on disconnect event
    socket.on("disconnect", () => {
      console.log("Parent Disconnected");

      connectedStudents = connectedStudents.filter((s) => {
        const existing = connections.find((c) => c.studentId === s.studentId);
        return !existing;
      });
    });

    // const  result  = await RequestService.getTodayRequestsByParent(id);
    //
    // if (result) {
    //   socket.emit("_parent_requests", result);
    // }

    // create request
    socket.on("_request_student", handleNewRequest);

    // REFRESH request
    socket.on("_fetch_student", handleRefreshRequest);

    // confirm request
    socket.on("_confirm_request", handleConfirmRequest);
  }

  async function teacherEvents(socket, { id }) {
    const teacher = { teacherId: id, socketId: socket.id };

    const connection = addTeacher(teacher);

    // const { result } = await RequestService.getTodayRequestsByTeacher(id);
    //
    // socket.emit("_teacher_requests", result);

    // REFRESH request
    socket.on("_fetch_student", handleRefreshRequestTeacher);

    // handle on disconnect event
    socket.on("disconnect", () => {
      console.log("Teacher Disconnected");
      connectedTeachers = connectedTeachers.filter(
          (s) => s.socketId !== connection.socketId
      );
    });

    // create request
    socket.on("_approve_request", (data) => {
      handleApproveRequest(data);
    });
  }

  async function teacherWebEvents(socket, { id }) {
    const teacher = { teacherId: id, socketId: socket.id };

    const connection = addTeacher(teacher);

    const { result } = await RequestService.getTodayRequestsByTeacher(id);

    socket.emit("_teacher_requests", result);


    // handle on disconnect event
    socket.on("disconnect", () => {
      console.log("Teacher Disconnected");
      connectedTeachers = connectedTeachers.filter(
          (s) => s.socketId !== connection.socketId
      );
    });

    // create request
    socket.on("_approve_request", (data) => {
      handleApproveRequest(data);
    });
  }

  async function clientEvents(socket, { id }) {
    const client = { clientId: id, socketId: socket.id };

    const connection = addClient(client);

    const { result } = await RequestService.getTodayRequestsByClient(id);

    socket.emit("_client_requests", result);

    // handle on disconnect event
    socket.on("disconnect", () => {
      console.log("Client Disconnected");
      connectedClients = connectedClients.filter(
          (s) => s.socketId !== connection.socketId
      );
    });

    // create request
    socket.on("_approve_request", (data) => {
      handleApproveRequest(data);
    });
  }
  async function guardEvents(socket, { id }) {
    const guard = { guardId: id, socketId: socket.id };

    const connection = addGuard(guard);
    socket.on("_request_student", handleNewRequest);

    // handle on disconnect event
    socket.on("disconnect", () => {
      console.log("Guard Disconnected");
      connectedClients = connectedClients.filter(
          (s) => s.socketId !== connection.socketId
      );
    });
  }
};
