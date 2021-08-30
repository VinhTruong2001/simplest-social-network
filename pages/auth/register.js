import RegisterForm from '../../components/RegisterForm'
import Head from 'next/head'

function Register() {
    return (
        <div>
            <Head>
                <title>Đăng ký Simplest</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <RegisterForm />
        </div>
    )
}

export default Register
