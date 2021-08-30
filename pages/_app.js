import '../styles/global.css'
import { StateProvider } from '../components/common/StateProvider'
import reducer, { initialState } from '../components/common/reducer';

function MyApp({ Component, pageProps }) {
  return (
    <StateProvider initialState={ initialState } reducer={ reducer }>
      <Component {...pageProps} />
    </StateProvider>
  )
}

export default MyApp
