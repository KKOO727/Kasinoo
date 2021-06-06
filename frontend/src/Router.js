import React, { Suspense, lazy } from "react"
import { Router, Switch, Route ,Redirect } from "react-router-dom"
import { history } from "./history"
import { connect } from "react-redux"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"
import { session_checked, setSidebar } from "./redux/actions/auth/loginActions"
import {  fake_session,getSession } from "./redux/actions/auth/index"
import { ToastContainer } from "react-toastify"
import * as URLS from "./urls";
import {cmsload} from "./redux/actions/auth/loginActions"
import { Notifications } from 'react-push-notification';

  const Login = lazy(() => import("./views/auth/login/Login"))
  const changepassword = lazy(()=>import("./views/auth/ChangePassword"))
  const Revenue = lazy(() => import("./views/dashboard/Revenue"))
  const AnalyTics = lazy(()=> import("./views/dashboard/analytics"));

  const players = lazy(()=> import("./views/players/players/players"));
  const PlayersInfo = lazy(()=> import("./views/Playersinfo"));
  const playersLimits = lazy(()=> import("./views/players/playersLimits/menumanager"));
  const PendingKyc = lazy(()=> import("./views/players/kyc/pendingkyc/menumanager"));
  const rejectingKyc = lazy(()=> import("./views/players/kyc/rejectkyc/menumanager"));
  const ApprovedKyc = lazy(()=> import("./views/players/kyc/approvedkyc/menumanager"));

  const PayoutChannel = lazy(() =>import("./views/finance/payoutchannel"));
  const DepostiHistory = lazy(()=> import("./views/finance/balancehistory/deposit"));
  const WithDrwaHistory = lazy(()=> import("./views/finance/balancehistory/withdraw"));
  const RequestPayout = lazy(()=> import("./views/finance/RequestPayout"));
  const CashTransactions = lazy(() => import("./views/finance/transactions/index"));
  const Bankdetail = lazy(() => import("./views/finance/bankdetail"));
  const FinanceShow = lazy(()=> import("./views/Playersinfo/finance"));
  const PaymentRestrictionDays = lazy(()=> import("./views/finance/restrictionDays"));
  
  
  const Users = lazy(()=> import("./views/users/users/users"));//users
  const RealTimeUsers = lazy(() => import("./views/users/realtimeusers/realtimeusers"));
  const GameRealTimeUsers = lazy(() => import("./views/users/gameusers/gameusers"));
  const Permissionmanager = lazy(() => import("./views/users/permissionManager/menumanager"));
  
  const FirstpageMng = lazy(()=>import("./views/cms/SliderManager/slider"));
  const MenuManager = lazy(()=>import("./views/cms/menumanager/menumanager"));
  const CasinoGamelist = lazy(()=>import("./views/cms/casinomanager/gamelist"));
  const LiveCasinoGamelist = lazy(()=>import("./views/cms/livecasinomanager/xpggamelist"));
  const Virtualgamelist =  lazy(()=>import("./views/cms/virtualgames/gamelist"));
  const CockFightGamelist =  lazy(()=>import("./views/cms/cockfight"));
  const AnimalGamelist = lazy(()=>import("./views/cms/animal"));
  
  const Firstpagemanager = lazy(()=>import("./views/cms/firstpagemanager/index"));
  const Sports_Manager =  lazy(()=>import("./views/cms/sports_manager/menumanager"));
  const Exchg_Manager =  lazy(()=>import("./views/cms/exchg_manager/menumanager"));
  const Quick_links = lazy(()=>import("./views/cms/quick_link/menumanager"));
  const Social_links = lazy(()=>import("./views/cms/socialLink/menumanager"));
  const Configurations = lazy(() => import("./views/cms/configurations/index"));
  const Porkerlist = lazy(() => import("./views/cms/porkermanager/index"));
  const NewsText = lazy(()=>import("./views/cms/newstext/menumanager"));
  const Faq_Manager = lazy(()=>import("./views/cms/faq_page/menumanager"));
  const ContactUs_Manager = lazy(()=>import("./views/cms/contactus_page/menumanager"));
  const AboutUs_Manager = lazy(()=>import("./views/cms/aboutus_page/menumanager"));
  const PrivacyPolicy_Manager = lazy(()=>import("./views/cms/privacypolicy_page/menumanager"));
  const FirstPageGameListSetting = lazy(()=>import("./views/cms/FirstPageGameListSetting/index"));
  const FirstPageCasinoGameListSetting = lazy(()=>import("./views/cms/FirstPageCasinoGameListSetting/index"));
  const FirstTopgamesSetting = lazy(()=>import("./views/cms/topgames/index"));
  const ProfilePageMenu = lazy(()=>import("./views/cms/ProfilePageMenu/index"));
  const featuresEvents = lazy(()=>import("./views/cms/featuresEvents/index"));
  const MobileMenuManager = lazy(()=>import("./views/cms/MobileMenuManager/index"));
  
  const Qapy = lazy(()=>import("./views/PaymentGateway/qpay"));
  const YaarPay = lazy(()=>import("./views/PaymentGateway/yaarPay"));
  const paymentMenu = lazy(()=>import("./views/PaymentGateway/paymentMenuManager"));
  const Netcents = lazy(()=>import("./views/PaymentGateway/netcents"));
  // const Cashfree = lazy(()=>import("./views/PaymentGateway/Cashfree"));
  const Paygate10 = lazy(()=>import("./views/PaymentGateway/paygate10"));
  const Razorpay = lazy(()=>import("./views/PaymentGateway/razorpay"));
  const paymoro = lazy(()=>import("./views/PaymentGateway/paymero"));
  
  const Providers = lazy(()=>import("./views/Games/Providers/menumanager"));
  const CasinoProviders = lazy(()=>import("./views/Games/casinoprovider/index"));
  const LiveCasinoProviders = lazy(()=>import("./views/Games/livecasinoprovider/liveprovider"));
  const VirtualGamesProviders = lazy(()=>import("./views/Games/virtualgamesprovider/index"));
  const PorkerProviders = lazy(()=>import("./views/Games/porkerprovider/index"));
  const CockfightProviders = lazy(()=>import("./views/Games/cockfightprovider/index"));
  const AnimalProviders = lazy(()=>import("./views/Games/animalprovider/index"));

  const BlocksUsers =  lazy(()=>import("./views/tools/blockUsers/users"));
  const IpBlock = lazy(()=>import("./views/tools/geoipblocks/menumanager"));

  const ReportsCasinoBygamesID = lazy(()=>import("./views/reports/casino/bygames/index"));
  const ReportsCasinoByPlayerID = lazy(()=>import("./views/reports/casino/byplay/index"));
  const ReportsCasinoByProviders = lazy(()=>import("./views/reports/casino/byproviders/index"));
  const ReportsCasinoByPlayerGameID = lazy(()=>import("./views/reports/casino/bybet/index"));

  const ReportsSattaBazar = lazy(()=>import("./views/reports/satta/byBazar"));
  const ReportsSattaMarket = lazy(()=>import("./views/reports/satta/byMartket"));
  const ReportsSattaPlayer = lazy(()=>import("./views/reports/satta/byplayer"));
  
  const ReportsSportsGames = lazy(()=>import("./views/reports/Sports/gamesby"));
  const ReportsPlayer = lazy(()=>import("./views/reports/Sports/playersby"));
  const ReportsBets = lazy(()=>import("./views/reports/Sports/Bets"));


  const error404 = lazy(() => import("./views/commingsoon/index"));

  const PromotionS_Bonus = lazy(() => import("./views/Promotions/bonus"));
  const Bonushitory = lazy(() => import("./views/Promotions/bonushistory"))
  const Bonusconfig = lazy(() => import("./views/Promotions/Bonusconfig"))
  

  const LivePrematch =lazy(() => import("./views/sports/live-prematch"));
  
  const newmanagepermission = lazy(() => import("./views/permission/index"));

  const CredentialSetting = lazy(()=> import('./views/setting/providercredential'));
  const DomainConfiguration = lazy(()=> import('./views/setting/domainconfig/index'));
  const Configuration = lazy(()=> import('./views/setting/configuration/index'));
  const GlobalSetting = lazy(()=> import('./views/setting/global/index'));
  const Notification = lazy(()=> import('./views/setting/notification'));
  const TypeManager = lazy(()=> import('./views/setting/typeManager'));
  const Language = lazy(()=> import('./views/setting/Language'));
  const ThemSetting = lazy(()=> import('./views/setting/ThemSetting'));
  

  const AllBazzar =  lazy(()=> import('./views/matka/dashboard/all'));
  const Games = lazy(()=> import('./views/matka/gameslist'));
  const Bazaars = lazy(()=> import('./views/matka/bazaar'));
  const MatkaNumbers = lazy(()=> import('./views/matka/dashboard/all/event'));

  const KingResult = lazy(()=> import('./views/matka/result/king'));
  const RegularResult = lazy(()=> import('./views/matka/result/regular'));
  const StartLineResult = lazy(()=> import('./views/matka/result/startline'));
  const MatkaRestrictionDays = lazy(()=> import('./views/matka/restrictiondays'));
  const MatkaBazarType = lazy(()=> import('./views/matka/MatkaBazarType'));
  
  const ResultAnnouncers = lazy(()=> import('./views/matka/dashboard/all/resultannouncer'));
  const DashBoardPlayers = lazy(()=> import('./views/matka/dashboard/betplayers'));


  const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
    <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag = fullLayout === true ? context.fullLayout : context.state.activeLayout === "horizontal" ? context.horizontalLayout : context.VerticalLayout
            return (
              <LayoutTag {...props} permission={"admin"}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)

const mapstopss = (state)=>{
  return {
    login : state.auth.login
  }
}

const AppRoute = connect(mapstopss,null)(RouteConfig)

const RequireAuth = (data) => {

  if (!getSession()) {
    fake_session();
    return <Redirect to={URLS.LoginUrl} />;
  }

  let sidebararray = data.sidebararray;

  if (data.children && sidebararray && sidebararray.length > 0)  {
    let items = data.children;

    for (var i in items) {

      let routers = ["/","/chagepassword",
        "/Players/infor","/finace/playershow",
        "/matka/dashboard/resultannouncer",
        "/matka/dashboard/numbers", "/matka/dashboard/players"
      ];// special router
      
      let path = data.location.pathname;

      if ( routers.indexOf(path) !== -1) {
        if ( items[i] && items[i].props.path === path) {
          return items.slice(0, items.length-1);
        }
      }
      
      let isExit = sidebararray.find(obj => obj.navLink === path);
      if ( items[i] && items[i].props.path === path && isExit) {
        return items.slice(0, items.length-1);
      }

    }

    return items.slice(items.length-1, data.children.length);
  } else {
    return [] 
  }
};


class AppRouter extends React.Component {

  componentWillMount(){
    let get_sess =  getSession(); // session existing
    if (get_sess) {
      this.props.session_checked(get_sess); // currently session checking
      this.props.setSidebar();//side bar loading
      this.props.cmsload(); // logo loading
    }
  }

  render(){
    return (  
      <Router history={history}>
        <Switch>
  
          {/*login router*/}
          <AppRoute path={URLS.LoginUrl} exact component={Login} fullLayout />

          {/*auth router*/}
            <RequireAuth  sidebararray={this.props.sidebararray}>
              {/* special router */}
              <AppRoute path="/" exact component={Revenue}/>
              <AppRoute path="/chagepassword" component={changepassword} />
              <AppRoute path="/Players/infor" component={PlayersInfo} />
              <AppRoute path="/finace/playershow" component={FinanceShow} />
              
              {/* dashboard part  */}
              <AppRoute path="/dashboard/Analytics" exact  component={AnalyTics} />
              <AppRoute path="/dashboard/Revenue" component={Revenue} />

              {/* players part  */}
              <AppRoute path="/Players/players" component={players} />
              <AppRoute path="/limits" component={playersLimits} />
              <AppRoute path="/kyc/Approved" component={ApprovedKyc} />
              <AppRoute path="/kyc/pending" component={PendingKyc} />
              <AppRoute path="/kyc/rejectingKyc" component={rejectingKyc} />
              
              {/* users part  */}
              <AppRoute path="/users/Users" component={Users} />
              <AppRoute path="/users/Realtimeusers" component={RealTimeUsers} />
              <AppRoute path="/users/gamesessionusers" component={GameRealTimeUsers} />
              <AppRoute path="/users/permissionmanager" component={Permissionmanager} />

              {/* finance part  */}
              <AppRoute path="/Players/DepositHitory" component={DepostiHistory} />
              <AppRoute path="/Players/WithdrawHistory" component={WithDrwaHistory} />
              <AppRoute path="/Players/RequestPayout" component={RequestPayout} />
              <AppRoute path="/finance/Transactions" component={CashTransactions} />
              <AppRoute path="/finance/payoutChannel" component={PayoutChannel} />
              <AppRoute path="/finance/bankdetail" component={Bankdetail} />
              <AppRoute path="/finance/restriction" component={PaymentRestrictionDays} />
              
              {/* gameprovider part  */}  
              <AppRoute path="/GameProviders/gameprovider/providers" component={Providers} />
              <AppRoute path="/GameProviders/gameprovider/casino" component={CasinoProviders} />
              <AppRoute path="/GameProviders/gameprovider/liveCasino" component={LiveCasinoProviders} />
              <AppRoute path="/GameProviders/gameprovider/virtualGames" component={VirtualGamesProviders} />
              <AppRoute path="/GameProviders/gameprovider/porker" component={PorkerProviders} />
              <AppRoute path="/GameProviders/gameprovider/cockfight" component={CockfightProviders} />
              <AppRoute path="/GameProviders/gameprovider/animal" component={AnimalProviders} />

              {/* paymentGateway part  */}  
              <AppRoute path="/PaymentGateway/paymentMenu" component={paymentMenu} />
              <AppRoute path="/PaymentGateway/qpay" component={Qapy} />
              <AppRoute path="/PaymentGateway/yaarpay" component={YaarPay} />
              <AppRoute path="/PaymentGateway/netcents" component={Netcents} />
              {/* <AppRoute path="/PaymentGateway/cashfree" component={Cashfree} /> */}
              <AppRoute path="/PaymentGateway/paygate10" component={Paygate10} />
              <AppRoute path="/PaymentGateway/razorpay" component={Razorpay} />
              <AppRoute path="/PaymentGateway/paymoro" component={paymoro} />
              
              {/* cms part  */}  
              <AppRoute path="/cms/slider/firspagemng" component={FirstpageMng} />
              <AppRoute path="/cms/menumanager" component={MenuManager} />
              <AppRoute path="/cms/Configurations" component={Configurations} />          
              <AppRoute path="/cms/casinolist" component={CasinoGamelist} />
              <AppRoute path="/cms/virtualgamelist" component={Virtualgamelist} />
              <AppRoute path="/cms/livecasinolist" component={LiveCasinoGamelist} />
              <AppRoute path="/cms/cockfight" component={CockFightGamelist} />
              <AppRoute path="/cms/animalgamelist" component={AnimalGamelist} />
              <AppRoute path="/cms/porkerlist" component={Porkerlist} />
              <AppRoute path="/cms/firstpagemanager" component={Firstpagemanager} />
              <AppRoute path="/cms/quick_links" component={Quick_links} />
              <AppRoute path="/cms/social_links" component={Social_links} />
              <AppRoute path="/cms/newsText" component={NewsText} />
              <AppRoute path="/cms/sports_manager" component={Sports_Manager} />
              <AppRoute path="/cms/exchgmanager" component={Exchg_Manager} />            
              <AppRoute path="/cms/faq_page" component={Faq_Manager} />
              <AppRoute path="/cms/contactus" component={ContactUs_Manager} />
              <AppRoute path="/cms/aboutus" component={AboutUs_Manager} />
              <AppRoute path="/cms/privacypolicy" component={PrivacyPolicy_Manager} />
              <AppRoute path="/cms/Firstpage-gamelist-setting" component={FirstPageGameListSetting} />
              <AppRoute path="/cms/Firstpage-casino-gamelist-setting" component={FirstPageCasinoGameListSetting} />
              <AppRoute path="/cms/profilemenu" component={ProfilePageMenu} />
              <AppRoute path="/cms/topGames" component={FirstTopgamesSetting} />
              <AppRoute path="/cms/featuresEvents" component={featuresEvents} />
              <AppRoute path="/cms/mobileMenuManager" component={MobileMenuManager} />

              
              {/* promotions part  */}  
              <AppRoute path="/Promotions/Bonus" component={PromotionS_Bonus} />
              <AppRoute path="/Promotions/bonushistory" component={Bonushitory} />
              <AppRoute path="/Promotions/bonusconfig" component={Bonusconfig} />
              
              {/* permission part  */}  
              <AppRoute path="/permission/manage" component={newmanagepermission} />

              {/* Tools part  */}  
              <AppRoute path="/Tools/blockusers" component={BlocksUsers} />
              <AppRoute path="/Tools/GeoIPBlocks/teenpatti" component={IpBlock} />

              {/* Reports part  */}  

              <AppRoute path="/reports/casino/ReportByProvider" component={ReportsCasinoByProviders} />
              <AppRoute path="/reports/casino/ReportBygames" component={ReportsCasinoBygamesID} />
              <AppRoute path="/reports/casino/ReportByPlayer" component={ReportsCasinoByPlayerID} />
              <AppRoute path="/reports/casino/ReportByPlayerGame" component={ReportsCasinoByPlayerGameID} />
              <AppRoute path="/reports/satta/byBazar" component={ReportsSattaBazar} />
              <AppRoute path="/reports/satta/byMarket" component={ReportsSattaMarket} />
              <AppRoute path="/reports/satta/byPlayer" component={ReportsSattaPlayer} />
              
              
              
              {/* sportspart */}
              <AppRoute path="/reports/sports/ReportBygames" component={ReportsSportsGames} />
              <AppRoute path="/reports/sports/ReportByPlayer" component={ReportsPlayer} />
              <AppRoute path="/reports/sports/ReportByBets" component={ReportsBets} />

              {/* sportsbook part  */}  
              {/* <AppRoute path="/Reports-Sportsbook/betReports" component={BetSports} /> */}
              <AppRoute path="/sportsbook/live-prematch" component={LivePrematch} />

              {/* setting part  */}  
              <AppRoute path="/setting/providersetting" component={CredentialSetting} />
              <AppRoute path="/Settings/Domainconfiguration" component={DomainConfiguration} />
              <AppRoute path="/setting/configuration" component={Configuration} />
              <AppRoute path="/setting/globalsetting" component={GlobalSetting} />
              <AppRoute path="/setting/notification" component={Notification} />
              <AppRoute path="/setting/typemanager" component={TypeManager} />
              <AppRoute path="/Settings/Language" component={Language} />
              <AppRoute path="/setting/themsetting" component={ThemSetting} />
              
              {/* matka part  */}  
              <AppRoute path="/matka/games" component={Games} />
              <AppRoute path="/matka/bazaars" component={Bazaars} />
              <AppRoute path="/matka/dashboard/all" component={AllBazzar} />
              <AppRoute path="/matka/result/startline" component={StartLineResult} />
              <AppRoute path="/matka/result/king" component={KingResult} />
              <AppRoute path="/matka/result/regular" component={RegularResult} />
              <AppRoute path="/matka/restrictionsday" component={MatkaRestrictionDays} />
              <AppRoute path="/matka/bazartype" component={MatkaBazarType} />
              
              <AppRoute path="/matka/dashboard/numbers" component={MatkaNumbers} />
              <AppRoute path="/matka/dashboard/resultannouncer" component={ResultAnnouncers} />
              <AppRoute path="/matka/dashboard/players" component={DashBoardPlayers} />
              
              {/* coming soon page   */}  
              <AppRoute component={error404} />
            </RequireAuth>
        </Switch>

        {/* loading part   */}  
        { this.props.loading ? <Spinner  /> : "" } 

        {/* alert part   */}  
        <ToastContainer />

        <Notifications />

      </Router>
    )
  }
}
const mapstops = (state)=>{
  return {
    loading : state.auth.login.loading,
    user : state.auth.login.values,
    sidebararray : state.auth.login.sidebararray
  }
}
export default connect(mapstops,{session_checked, setSidebar,cmsload})(AppRouter)