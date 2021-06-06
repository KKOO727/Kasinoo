import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Button,CustomInput
} from "reactstrap"
import DataTable from "react-data-table-component"
import { Star, Search } from "react-feather"
import img from "../../assets/img/pronet/andar-bahar-blue-4_300x200.jpg"
import {  Check,X} from "react-feather"
import {connect} from "react-redux"
import { Root } from "../../authServices/rootconfig"
import { toast } from "react-toastify"
import {getGamesListWithLimits,gamecheck,gamereject} from "../../redux/actions/xpg/getGamesListWithLimits"
import {fp_load_game_images,fpgamecheck} from "../../redux/actions/CMS/firstpageMngAction"
const CustomHeader = props => {
  return (
    <div className="d-flex flex-wrap justify-content-between">
      <div className="add-new">
        {/* <Button.Ripple color="primary">Add New</Button.Ripple> */}
      </div>
      <div className="position-relative has-icon-left mb-1">
        <Input value={props.value} onChange={e => props.handleFilter(e)} />
        <div className="form-control-position">
          <Search size="15" />
        </div>
      </div>
    </div>
  )
}

class Gamelist extends React.Component {
  state = {
    columns: [
      {
        name: "ID",
        selector: "gameID",
        sortable: true,
        maxWidth: "50px",
      },
      {
        name: "dealers",
        selector: "dealerImageUrl",
        sortable: true,
        maxWidth: "60px",
        cell: params => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              <img
                className="rounded-circle"
                src={params.dealerImageUrl}
                alt="user avatar"
                height="40"
                width="40"
              />
            </div>
          )
        }
      },
    
      {
        name: "Name",
        selector: "gameName",
        sortable: true,
      },
      {
        name: "GameImage",
        selector: "gameimgs",
        sortable: true,
        width: "110px",
        cell: params => {
          return (
            <div className="d-flex align-items-center cursor-pointer">
              {(()=>{
                if (params.gameimage) {
                  return (
                    <img style={{width:"100px", height:"46px"}} src={img} />
                  )
                }
              })()}
            </div>
          )
        }
      },
      {
        name: "SelectImage",
        selector: "SelectImage",
        sortable: true,
        minWidth: "180px",
        cell: params => {
          return (
            <CustomInput onChange={(e)=>{this.gameImageAdd(params.gameID,e.target.files[0])}} accept="image/png, image/jpeg" id="gameimage" type="file" />
          )
        }
      },
      {
        name: "Status",
        selector: "status",
        sortable: true,
        maxWidth: "70px",
        cell: params => (
          <Badge
            color={params.fpallow === true ? "light-success" : params.fpallow === false ? "light-warning" :  "light-warning" }
          pill>
          {params.fpallow === true ? "Allow" : params.fpallow === false ? "New" : "New"}
        </Badge>
        )
      },
   
      {
        name: "Actions",
        selector: "transactions",
        cell: (params) => {
          return (
            <div className="d-flex">
              <div className="badge badge-pill badge-light-success">
                <Check
                  size={20} 
                  onClick={() => {
                    this.gamecheck(params.gameID,true);
                  }}
                  />
              </div>
              <div className="badge badge-pill badge-light-danger">
                <X
                size={20}
                onClick={() => {
                  this.gamecheck(params.gameID, false);
                }}
              />
              </div>
            </div>
          )
        }
      }
    ],
    data: [],
    filteredData: [],
    value: "", 
    gameType : '0',
    gamestypes : [
      { value: "0", label: "All Games " },
      { value: "1", label: "Roulette" },
      { value: "2", label: "Blackjack" },
      { value: "4", label: "Baccarat" },
      { value: "8", label: "Live Texas Hold’em Bonus " },
      { value: "12", label: "Dragon Tiger" },
      { value: "16", label: "Sic-Bo " },
      { value: "18", label: "Caribbean Poker" },
      { value: "22", label: "Wheel Of Fortune" },
      { value: "24", label: "Andar Bahar" },

    ],
    onlineOnly : "0",
    netstates : [
      { value: "0", label: "off line and online" },
      { value: "1", label: "online only" },
    ],
    netstate :"0",
    username : "burkodegor",
    operatorId : "2152",
    serverurl : "https://api.xpgstaging.com/Services/ExternalApi.svc/",
    privatekey : "EsNR5UeMBmhJX4QfCgpFzvck6YVydt"
  }

  UNSAFE_componentWillMount(){

    this.props.getGamesListWithLimits({
      username : this.state.username,
      netstate : this.state.netstate,
      gameType : this.state.gameType
    });

  }
  
  gamecheck = (id,data) =>{
    this.props.fpgamecheck({id : id, data : data});
  }

  gameImageAdd (id, file) {
    if (!file) {
      toast.warning('You have not seleted any file.');
      return;
    }else if (file.type.split("/")[0] !== 'image') {
      toast.warning('Please select only image file.');
      return;
    }
    // let reader = new FileReader()
    // reader.readAsDataURL(file)
    // reader.onload = () => {
    //   this.state.gameimgs = reader.result;
    //   this.state.gameimgid = id
    // };
    // reader.onerror = function (error) {
    // }
    var me = this;
    var xml = new XMLHttpRequest();
      const fpdata = new FormData();
      fpdata.append('fpgameimg', file);
      fpdata.append('id', id);
      xml.open('post', Root.adminurl + "cms/firstpageGameImg");
      xml.send(fpdata);
      xml.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
          var rdata = JSON.parse(xml.responseText);
          if (rdata == "Upload faild.") {
            toast.error("Upload Faild.");
          }else if (rdata == "Database error.") {
            toast.error("Database Error.");
          }else {
            toast.success("Uploaded Successfully");
            me.props.fp_load_game_images(rdata);
          }
      }
    };
  }

  handleFilter = e => {
    let value = e.target.value
    let data = this.state.data
    let filteredData = this.state.filteredData
    this.setState({ value })

    if (value.length) {
      filteredData = data.filter(item => {
        let startsWithCondition =
          item.gameID.toLowerCase().startsWith(value.toLowerCase()) ||
          item.date.toLowerCase().startsWith(value.toLowerCase()) ||
          item.email.toLowerCase().startsWith(value.toLowerCase()) ||
          item.revenue.toLowerCase().startsWith(value.toLowerCase()) ||
          item.status.toLowerCase().startsWith(value.toLowerCase())
        let includesCondition =
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.date.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.revenue.toLowerCase().includes(value.toLowerCase()) ||
          item.status.toLowerCase().includes(value.toLowerCase())
        if (startsWithCondition) {
          return startsWithCondition
        } else if (!startsWithCondition && includesCondition) {
          return includesCondition
        } else return null
      })
      this.setState({ filteredData })
    }
  }

  render() {
    if(this.props.gamelist){
      for (let i = 0; i < this.props.gamelist.length; i++) {
        this.props.gamelist[i].gameimage = this.props.fp_game_images[this.props.gamelist[i].gameID];
        this.props.gamelist[i].fpallow = this.props.fp_game_image_allow[this.props.gamelist[i].gameID];
      }
      this.state.data = this.props.gamelist;
    }
    let { data, columns, value, filteredData } = this.state
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom</CardTitle>
        </CardHeader>
        <CardBody className="rdt_Wrapper">
          <DataTable
            className="dataTable-custom"
            data={value.length ? filteredData : data}
            columns={columns}
            noHeader
            pagination
            subHeader
            subHeaderComponent={
              <CustomHeader value={value} handleFilter={this.handleFilter} />
            }
          />
        </CardBody>
      </Card>
    )
  }
}

const get_gamelist = (state) =>{
  return {
    gamelist : state.xpggame.gameload.GamesListWithLimits,
    user : state.auth.login,
    fp_game_images : state.cms.fpMng.firstpagegameimage,
    fp_game_image_allow: state.cms.fpMng.firstpageimageallow
  }
}
export default connect(get_gamelist,{getGamesListWithLimits,fp_load_game_images,gamecheck,gamereject,fpgamecheck})(Gamelist)