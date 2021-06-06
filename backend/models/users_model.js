const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const basecontroller = require("../controller/time")

const users = () =>{
    var  UserSchema = new Schema({
        fakeid : { type : Number },  
        date: { type: Date,  },
        updatedAt: { type: Date,  },
        email : { type : String, required : true,unique: true,},
        username: { type: String, unique: true, required: [true, "username is required"] },
        password: {
            type: String,
            unique: false,
            validate: {
              validator: function (v) {
                return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v);
              },
              message: props => `${props.value} is not a valid password`
            },
            required: [true, "password is required"]
          },
        firstname : { type : String,  required : true },
        lastname : { type : String,  required : true },
        permission :{ type : String, required : true },
        status : { type : String, required : true },    
        created : {type : String, required : true },
        positiontaking : {type :Number,default : 0},
        signup_device : { type : String, },
        botdevice : { type : String, },
        isdelete : { type : Boolean, default : false },

        currency : { type : String, default : "INR" },
        country_name : { type : String, default : "" },
        region_name : { type : String, default : "" },
        birth_region_code : { type : String, default : ""},
        birth_region_id : {type : String, default : "" },
        birth_department : {type : String, default : "" },
        birth_city : {type : String, default : "" },
        time_zone : { type : String, default : "" },
        city_name : { type : String, default : "" },
        country_code : { type : String, default : "" },
        zip_code  : {type : String, default : "" },
        area_code : { type : String, default : "" },
        ip : { type : String, default : "" },
        contact : { type : String, default : "" },
        address : { type : String, default : "" },
        mobilenumber :{ type : String,default :""},
        avatar : { type : String, default: ""},
        accountholder : { type : String, default : "" },
        cashdesk : { type : String, default : ""},
        language : { type : String, default : "" },
        middlename : { type : String, default : "" },
        phone : { type : String, default : "" },
        personal_id : {type : String, default : "" },
        affiliate_id : {type : String, default : "" },
        btag : {type : String, default : "" },
        external_id : {type : String, default : "" },
        balance : {type : String, default : "" },
        document_issue_code : {type : String, default : "" },
        document_issuedby : {type : String, default : "" },
        document_number : {type : String, default : "" },
        iban : {type : String, default : "" },
        is_logged_in : {type : String, default : "" },
        profile_id : {type : String, default : "" },
        promo_code : {type : String, default : "" },
        province : {type : String, default : "" },
        registration_source : {type : String, default : "" },
        client_category : {type : String, default : "" },
        swiftcode : {type : String, default : "" },
        bank_name : {type : String, default : "" },
        state : {type : String, default : "" },
        last_login_ip : {type : String, default : "" },
        sport_last_bet : {type : String, default : "" },
        gaming_last_bet : {type : String, default : "" },
        custome_player_category : {type : String, default : "" },
        wrong_login_attempts : {type : String, default : "" },
        pep_status : {type : String, default : "" },
        gender : { type : String, default : ""},
        
        last_login_date : {type : String, default : "" },
        first_deposit_date : {type : String, default : "" },
        document_issue_date : {type : Date, default : "" },
        wrong_login_block_time : {type : Date, default : "" },
        birthday : { type : Date, default : "" },
        
        test : { type : Boolean, default : false },
        is_verified : {type : Boolean, default : false },
        subscribedtosms : {type : Boolean,default : false},
        subscribedtoemail : {type : Boolean,default : false},
        subscribed_to_newsletter : {type : Boolean, default : false },
        subscribed_to_phone_call : {type : Boolean, default : false },
        subscripted_internal_message : {type : Boolean, default : false },
        subscribed_to_push_notifications : {type : Boolean, default : false },
        usingloyaltyprogram : { type : Boolean, default : false },

        idverify : {type : Boolean,default : false},
        resident : { type : Boolean, default : false },
        emailverify : { type : Boolean, default : false },
        playerid : { type: Schema.Types.ObjectId, ref: 'user_players' },
        permissionid : { type: Schema.Types.ObjectId, ref: 'user_role' },
    });

    UserSchema.methods.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
      
    UserSchema.methods.validPassword = function (password, encrypted) {
        return bcrypt.compareSync(password, encrypted);
    }
    
    
    UserSchema.pre('save', function() {
        this.set({ fakeid: get_max_id() });
        this.set({ date: basecontroller.Indiatime() });
    });

    UserSchema.pre('find', function () {
        // `this` is an instance of mongoose.Query
        this.populate('playerid',["balance","bonusbalance"]).populate('permissionid',["title","id","pid"]);
        this.select(["username","email","password",
            "lastname",
            "firstname",
            "status",
            "created",
            "positiontaking",
            "signup_device",
            "isdelete",
            "gender",
            "mobilenumber","permission","avatar","fakeid","date","address","botdevice",'language'
        ]);
    });
   

    UserSchema.pre('findOne', function () {
        // `this` is an instance of mongoose.Query
        this.populate('playerid',["balance","bonusbalance"]).populate('permissionid',["title","id","pid"]);
        this.select(["username","email","password",
            "lastname",
            "firstname",
            "status",
            "created",
            "positiontaking",
            "signup_device",
            "isdelete",
            "gender",
            "mobilenumber","permission","avatar","fakeid","date","address","botdevice","language"
        ]);
    });

    UserSchema.pre('findOneAndUpdate', function() {
        this.set({ updatedAt: basecontroller.Indiatime()});
    });
    UserSchema.pre('updateOne', function() {
        this.set({ updatedAt: basecontroller.Indiatime() });
    });

   
    return mongoose.model("user_users", UserSchema)
    // return mongoose.model("user1", UserSchema)
}

function get_max_id (){
    var a = new Date().valueOf() + "";
    var b=  a.slice((a.length-1-7),(a.length-1));
    return b;
}


const Players = ()=>{
    var  UserSchema = new Schema({
        username: {
            type: String,
            required : true,unique:true
        },
        id: {
            type: String,
            required : true,
            unique:true,
        },
        userid: {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        email: {
            type: String,
            required : true,unique:true
        },
        balance : {
            type : Number,
            default : 0
        },
     
        firstname : {
            type: String,
            required : true
        },
        lastname : {
            type: String,
            required : true
        },
        pid : {
            type : Number,
        },
        bonusbalance : {
            type : Number,
            default : 0
        },
    });
    
    UserSchema.pre('save', function() {
        this.set({ pid: get_max_id() });
    });

    return mongoose.model("user_players", UserSchema)
    // return mongoose.model('netplayerusers', UserSchema)
}

const admin_them = () =>{
    var  UserSchema = new Schema({
        layout: {
            type: String,
            default : "vertical"
        },
        theme: {
            type: String,
            default : "dark"
        },
        sidebarCollapsed: {
            type: Boolean,
            default : false
        },
        navbarColor: {
            type: String,
            default : "success"
        },
        navbarType : {
            type: String,
            default : "floating"
        },
        footerType : {
            type: String,
            default : "static"
        },
        disableCustomizer: {
            type: Boolean,
            default : false
        },
        hideScrollToTop: {
            type: Boolean,
            default : false
        },
        disableThemeTour: {
            type: Boolean,
            default : false
        },
        menuTheme : {
            type: String,
            default : "success"
        },
        direction : {
            type: String,
            default : "ltr"
        },
        email :{
            type: String,
            default : ""
        }
    });
    return mongoose.model("user_theme", UserSchema)
}

const sessionmodel = () =>{
    var  UserSchema = new Schema({
        socketid: {
            type: String,
            required : true
        },
        chatid: {
            type: String,
            required : true
        },
        id: {
            required : true,
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        date: {
            type: Date,
        },
    });

    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });

    return mongoose.model("user_socket", UserSchema)
}


const usersesmodel = () =>{
    var  UserSchema = new Schema({
       
       
        inittime : {
            required: true,
            type: Date,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        id: {
            type: Schema.Types.ObjectId, ref: 'user_users',
        },
        ip: {
            type: String,
        },
        socketuser: {
            type: Schema.Types.ObjectId, ref: 'user_socket',
        },
    });
    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });
    return mongoose.model("user_session", UserSchema)
}

const gamesessionmodel = () =>{
    var  UserSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            default: "INR"
        },
        date: {
            type: Date,
        },
        token : {
            type :String,
            required : true
        },
        intimestamp : {
            type: Date,
            required: true
        },
        id :{
            type: String,
            required: true
        },
    });

    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });
    return mongoose.model("user_gamesession", UserSchema)
}

const playerlimitModel = () =>{
    var  UserSchema = new Schema({
        email: {
            type: String,
            required: true,unique:true
        },
        daylimit : {
            type:Number,
            default :5000 
        },
        weeklimit : {
            type:Number,
            default :15000 
        },
        monthlimit : {
            type:Number,
            default :100000 
        },
        userid : {
            type: Schema.Types.ObjectId, ref: 'user_users'
        }
    });


    UserSchema.pre('find', function () {
        this.populate('userid');
       
    });
    return mongoose.model("user_plimit", UserSchema)
}



const permission_model = () =>{
    var  UserSchema = new Schema({
        title:{
            type : String,
            required : true
        },
        order : {
            type : Number,
            default : 0
        },
        id :{
            type : String,
            required : true,
            unique : true
        },
        pid : { 
            type : String,
            default : 0
        },

    });
    return mongoose.model("user_role", UserSchema)
}

const totalusermodel = () =>{
    var UserSchema = new Schema({
        email : {
            type : String,
            required : true  
        },
        ip : {
            type : String,
            required : true  
        },
        date: {
            type: Date,
        },

    });

    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });
    return mongoose.model("user_totalloginusers", UserSchema);
}

const totalgamesusermodel = () =>{
    var UserSchema = new Schema({
        email : {
            type : String,
            required : true  
        },
        date: {
            type: Date,
        },

    });
    UserSchema.pre('save', function() {
        this.set({ date: basecontroller.Indiatime() });
    });

    return mongoose.model("user_totalgamesusers", UserSchema);
}

const sidebarmodel = () =>{
    var  UserSchema = new Schema({
        roles : {
            type : Object,
            required : true,
        },
        navLink : {
            type : String,
            required : true
        },
        id : {
            type : String,
            required : true,
            unique  :true,
        },
        icon : {
            type : String,
            required : true
        },
        title : {
            type : String,
            required : true
        },
        status : {
            type : Boolean,
            required : true
        },
        pid : {
            type : String,
            required : true
        },
        type : {
            type : String,
            required : true
        },
        children : {
            type : Object,
            default : []
        },
        order : {
            type : Number,
            required : true
        }
    });
    return mongoose.model("user_adminsidebar", UserSchema);
}

const wallethistory_model = () =>{
    var  UserSchema = new Schema({
        roundid : {
            type: String,
            required : true
        },
        transactionid : {
            type: String,
            required : true
        },
        bonus : {
            type :Boolean,
            default :false
        },
        // GAMEID : {
        //     type : String,
        //     required : true,
        // },
        // LAUNCHURL : {
        //     type : String,
        //     required : true,
        // },
        status :{
            type : String,
            required : true,
        },
        lastbalance : {
            type : Number,
            required : true
        },
        gameid : {
            type: Schema.Types.ObjectId, ref: 'game_game_list',
        },
        sportid : {
            type: Schema.Types.ObjectId, ref: 'sports_list',
        },
        sportsData : {
            type: Object,
        },
        userid : {
            type: Schema.Types.ObjectId, ref: 'user_users',
        },
        paymentid : {
            type: Schema.Types.ObjectId, ref: 'Payment_history',
        },
        bazaarid : {
            type: Schema.Types.ObjectId, ref: 'matka_Bazaar',
        },
        matkabetid : {
            type: Schema.Types.ObjectId, ref: 'matka_betmodels',
        },
        bonushisid : {
            type: Schema.Types.ObjectId, ref: 'promotion_bonushistory',
        },
        
        // USERID : {
        //     type : String,
        //     required : true
        // },
        commission : {
            type : Number,
            required : true
        },
        credited : {
            type : Number,
            required : true,
        },
        debited : {
            type : Number,
            required : true
        },
        updatedbalance : {
            type : Number,
            required : true
        },
        updated : {
            type: Date,
        },
    });

    UserSchema.pre('save', function() {
        this.set({ updated: basecontroller.Indiatime() });
    });
    return mongoose.model("user_wallethistory", UserSchema);
}

const profilemenu_model = () =>{
    var  UserSchema = new Schema({
       
        navLink : {
            type : String,
            required : true
        },
        id : {
            type : String,
            required : true,
            unique  :true,
        },
        icon : {
            type : String,
            required : true
        },
        title : {
            type : String,
            required : true
        },
        status : {
            type : Boolean,
            required : true
        },
        mobilestatus : {
            type : Boolean,
            required : true
        },
        pid : {
            type : String,
            required : true
        },
        type : {
            type : String,
            required : true
        },
        children : {
            type : Object,
            default : []
        },
        order : {
            type : Number,
            required : true
        },
        mobileicon : {
            type : String,
            required : true
        }
    });
    return mongoose.model("user_profilemenu", UserSchema);
}


const friendModel = () =>{
    var  UserSchema = new Schema({
       
        FriendUserId : {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        UserId : {
            type: Schema.Types.ObjectId, ref: 'user_users'
        },
        UserEmail : {
            type: String,
            required : true
        },
        
    });
    return mongoose.model("user_friendModel", UserSchema);
}


module.exports  = {
    totalusermodel : totalusermodel(),
    totalgamesusermodel : totalgamesusermodel(),
    adminUser : users(),
    get_themeinfor: admin_them(),
    sessionmodel  :sessionmodel(),
    usersessionmodel  :usersesmodel(),
    GamePlay : Players(),
    gamesessionmodel : gamesessionmodel(),
    playerlimit : playerlimitModel(),
    // balance_histoy : balance_histoy(),
    permission_model : permission_model(),
    sidebarmodel : sidebarmodel(),
    wallethistory : wallethistory_model(),
    profilemenu : profilemenu_model(),
    friendModel : friendModel(),

}