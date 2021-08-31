import '../styles/global.css'
import { StateProvider } from '../components/common/StateProvider'
import Layout from '../components/Layout'
import reducer, { initialState } from '../components/common/reducer';

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider initialState={ initialState } reducer={ reducer }>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StateProvider>
  )
}

export default MyApp
