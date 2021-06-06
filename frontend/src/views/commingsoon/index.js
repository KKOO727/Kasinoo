// // import React from "react"
// // import { Row,} from "reactstrap"
// // class Gamelist extends React.Component {
  
//   //   render() {
//     //     return (
//       //       <React.Fragment>
//       //           <Row>
//       //             <img style={{width:"100%",height : "100%"}} alt="comming soon" src="https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/9432a2ad-f01d-4a3d-ae53-370c37e15e62/2018/01/16/4b638361-3888-4e77-b1ea-af956fa98d7f.png" />
//       //           </Row>
//       //       </React.Fragment>
//       //     )
//       //   }
//       // }
      
//       // export default Gamelist
      
      
// import React from "react"
// import { Card, CardBody, Row, Col } from "reactstrap"
// // import errorImg from "../../assets/img/ComingSoon.jpg"
// import errorImg from "../../assets/img/pages/404.png"

// class Error404 extends React.Component {
//   state = {
//     hour : new Date().getHours(),
//     minute : new Date().getMinutes(),
//     second : new Date().getSeconds(),
//     point : ":",
//     flag : true
//   }

//   UNSAFE_componentWillMount()
//   {
//     this.time();
//   }
  
//   time = () => {
//     setInterval(() => {
//       let dt = new Date();

//       let hour = dt.getHours();
//       let minute = dt.getMinutes();
//       let second = dt.getSeconds();
//       let point = ":";

//       point = this.state.flag ? ":" : "";
//       hour = hour < 10 ? "0" + hour : hour;
//       minute = minute < 10 ? "0" + minute : minute;
//       second = second < 10 ? "0" + second : second;

//       this.setState({hour : hour , minute : minute , second : second , point : point , flag : !this.state.flag});
//     }, 1000);
//   }

//   render() {
//     return (
//       <Row className="m-0 commingsoon_first">
//         <Col sm="12">
//           <Card className="auth-card bg-transparent shadow-none rounded-0 mb-0 w-100">
//             <CardBody className="text-center">
//               <img
//                 src={errorImg}
//                 alt="ErrorImg"
//                 className="img-fluid align-self-center commingsoon_img"
//               />
//               <h1 className="font-large-2 coomingsoon_h1"> We are coming soon !</h1>
//               {/* <p className="pt-2 mb-0 comingsoon_p20">
//                  Hello EveryOne. Thank you for your visit.
//               </p>
//               <p className="pt-2 mb-0 comingsoon_p16">
//                 Now We are doing some modify website continue.
//                 This page will appear as soon.
//               </p>
//               <p className="pb-2 comingsoon_p16">
//                 Current page not exist in website yet. Please wait.
//               </p> */}
//               <Row className = "commingsoon_second">
//                 <Col className = "commingsoon_col">{this.state.hour}</Col>
//                 <Col className = "commingsoon_col"> {this.state.point} </Col>
//                 <Col className = "commingsoon_col">{this.state.minute}</Col>
//                 <Col className = "commingsoon_col"> {this.state.point} </Col>
//                 <Col className = "commingsoon_col">{this.state.second}</Col>
//               </Row>
//               {/* <Button.Ripple
//                 tag="a"
//                 href="/"
//                 color="primary"
//                 size="lg"
//                 className="mt-2"
//               >
//                 Back to Home
//               </Button.Ripple>
//               <p className="pb-2 comingsoon_last">
//                 Copyright 2020 by Ehor.Ru, All right reserved.
//               </p> */}
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     )
//   }
// }
// export default Error404


import React from "react"
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from "reactstrap"
import csImg from "../../assets/img/pages/rocket.png"
import "../../assets/scss/pages/coming-soon.scss"
import Countdown from "react-countdown-now"

class ComingSoon extends React.Component {
  renderTimer = ({ days, hours, minutes, seconds }) => {
    return (
      <React.Fragment>
        <div className="clockCard px-1">
          <p>{days}</p>
          <p className="bg-amber clockFormat lead px-1 black"> Days </p>
        </div>
        <div className="clockCard px-1">
          <p>{hours}</p>
          <p className="bg-amber clockFormat lead px-1 black"> Hours </p>
        </div>
        <div className="clockCard px-1">
          <p>{minutes}</p>
          <p className="bg-amber clockFormat lead px-1 black"> Minutes </p>
        </div>
        <div className="clockCard px-1">
          <p>{seconds}</p>
          <p className="bg-amber clockFormat lead px-1 black"> Seconds </p>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <Row className="d-flex vh-100 align-items-center justify-content-center m-0">
        <Col xl="12" md="12" className="vh-100" >
          <Card className="mb-0 vh-100 p-5">
            <CardHeader className="justify-content-center">
              <h2>We are launching soon</h2>
            </CardHeader>
            <CardBody className="text-center">
              <img src={csImg} alt="csImg" className="img-fluid width-150" />
              <div className="text-center getting-started pt-2 d-flex justify-content-center flex-wrap">
                <Countdown
                  date={Date.now() + 10000000000}
                  renderer={this.renderTimer}
                />
              </div>
              {/* <div className="divider">
                <div className="divider-text">Subscribe</div>
              </div>
              <p className="text-left mb-2">
                If you would like to be notified when our app is live, Please
                subscribe to our mailing list by entering your email.
              </p>
              <Form>
                <FormGroup className="form-label-group">
                  <Input placeholder="Email" />
                  <Label>Email</Label>
                </FormGroup>
              </Form>
              <Button.Ripple block color="primary" className="btn-block">
                Subscribe
              </Button.Ripple> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}
export default ComingSoon
