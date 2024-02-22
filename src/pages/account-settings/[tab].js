import AccountSettings from 'src/views/account-settings/AccountSettings'

const AccountSettingsTab = ({ tab }) => {
  return <AccountSettings tab={tab} />
}

export const getStaticPaths = () => {
  return {
    paths: [{ params: { tab: 'account' } }, { params: { tab: 'billing' } }, { params: { tab: 'invoice' } }],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default AccountSettingsTab
