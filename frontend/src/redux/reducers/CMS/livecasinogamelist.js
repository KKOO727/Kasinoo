
import {cmslivecasinoget,cmslivecasinoload,cmslivecasinoTypes,cmslivecasinoProvider,cmslivecasinoSetProvider,cmslivecasinoSetType
} from "../../types"

const initialState = {
    data: [],
    params: null,
    allData: [],
    totalPages: 0,
    filteredData: [],
    totalRecords: 0,
    sortIndex: [0,0],
    providerData : [],
    types : [],
    settype : {label : "All",value : ''},
    setprovider : {label : "All",value : ''},
    moredata : [],
    deftypes : [],
    provideroptions : [],
    typeoptions : [],
    idoptions : []
  }
  
export  const livecasinogamelist = (state = initialState, action) => {
    switch (action.type) {
      case cmslivecasinoget:
        return {
          ...state,
          typeoptions : action.typeoptions,
          provideroptions : action.provideroptions,
        }
      case cmslivecasinoload:
       
        return {
          ...state,
          data: action.data,
          totalPages: action.totalPages,
          params: action.params,
          totalRecords: action.totalRecords,
          sortIndex : [action.params["skip"] + 1,action.params["skip2"]],
          setproviderid : action.setproviderid
        }


        case cmslivecasinoTypes:{
            return {
                ...state,types : action.data
            }
        }
        

        case cmslivecasinoSetProvider :{
            return {
                ...state,setprovider : action.data
            }
        }
        

        case cmslivecasinoSetType :{
            return {
                ...state,settype : action.data
            }
        }
        
        case cmslivecasinoProvider:{
            return {
                ...state,providerData : action.data,setprovider  :action.setprovider,moredata : action.moredata,
                deftypes : action.deftypes
            }
        }
      default:
        return state
    }
  }