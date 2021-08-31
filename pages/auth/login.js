import LoginForm from "../../components/auth/LoginForm"
import Head from 'next/head'

function Login() {
    return (
        <div>
            <Head>
                <title>Đăng nhập vào Simplest</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <LoginForm />
        </div>
    )
}

export default Login
