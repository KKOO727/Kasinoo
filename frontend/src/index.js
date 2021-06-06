import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Layout } from "./utility/context/Layout"
import * as serviceWorker from "./serviceWorker"
import { store } from "./redux/storeConfig/store"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"
import "./index.scss"
import "./assets/scss/plugins/extensions/react-paginate.scss"
import "./assets/scss/pages/data-list.scss"
import "./assets/scss/plugins/forms/switch/react-toggle.scss"
import "./assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import "./assets/scss/pages/app-ecommerce-shop.scss"
import "./assets/scss/plugins/extensions/slider.scss"
import "./assets/scss/plugins/extensions/toastr.scss"
import "./components/@vuexy/rippleButton/RippleButton"
import "flatpickr/dist/themes/light.css";
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import "react-toggle/style.css"
import "rc-slider/assets/index.css"
import "react-toastify/dist/ReactToastify.css"
import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import 'jsoneditor-react/es/editor.min.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import "./assets/scss/components/customizer.scss"
const LazyApp = lazy(() => import("./App"))

// configureDatabase()

ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <Layout>
            <LazyApp />
        </Layout>
      </Suspense>
    </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()