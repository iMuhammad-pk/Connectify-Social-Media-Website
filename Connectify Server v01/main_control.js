/*Required Files for the server*/
const connectify_express=require('express');
const connectify_server = connectify_express(); /*To utilize express functions */
const connectify_middle = require('body-parser'); /*Main Middle-ware to handle requests form website*/
const dynamic_url = require('cors'); /*Server and Website IP different handling  cross origin resource sharing*/
const path=require('path'); /*Path handling to redirect pages */
const o_stream =require('fs');
const multer =require('multer');
const cookie_parse=require('cookie-parser');

/*Server usage */
connectify_server.use(dynamic_url());
connectify_server.use(cookie_parse());
connectify_server.use(connectify_middle.urlencoded({extended:true}));
global.current_workspace=path.resolve(__dirname,'..');
connectify_server.use(connectify_express.static(current_workspace));
/*Change this path according to where this workspace is saved!*/
/*Global Variables*/
global.web_htmlcss_path=path.resolve(__dirname,'..','./web_htmlcss');
global.web_files_path=path.resolve(__dirname,'..','./web_files');
global.temp_user="default";
global.temp_id=0;
global.Saved_user=multer({dest: web_files_path+'/Post_files/'+temp_user+temp_id+'/'});
/*Routing Setting */
const server_ip = "192.168.1.7"; /*DO CHANGE WHEN URL/IPV4 CHANGES MANDATORY*/
const server_port = 5500;
/*Server Listening */
connectify_server.listen(server_port,server_ip,(server_error)=>{
    console.log("***********************************");
    console.log("Connectify Server is now online!");
    console.log("Listening to "+server_ip+":"+server_port);
    console.log("***********************************");
})
/*GET requests */
connectify_server.get('/',(required,sender)=>{
   sender.redirect('./www.connectify.com/');
})
connectify_server.get('/www.connectify.com/',(required,sender)=>{
    sender.sendFile(web_htmlcss_path+'/web_login.html');
})
connectify_server.get('/www.connectify.com/:temp_user:temp_id/Profile_Edit',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    Saved_user=multer({dest: web_files_path+'/Post_files/'+user_name+user_id+'/'});
    sender.sendFile(web_htmlcss_path+'/web_pedit.html');
})
connectify_server.get('/www.connectify.com/:temp_user:temp_id/Home_page',(required,sender)=>{
    sender.sendFile(web_htmlcss_path+'/web_homepage.html');
})
connectify_server.get('/home_page',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    Get_Post(user_id,(user_data)=>{
        if(!user_data){console.log("\nGet_Post Query Error!\n");}else{
            sender.send(user_data);
        }
    })
})
connectify_server.get('/get_cookie',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    sender.send(Logged_Cookie);
})
connectify_server.get('/read_txt',(required,sender)=>{
    console.log(required.query.post_id);
    let txt_path=path.join(web_files_path+'/Post_files/'+temp_user+temp_id+'/',required.query.post_id+".txt");
    o_stream.readFile(txt_path,'utf-8',(error,text)=>{
            if(error){console.log("Error! reading the file\n");}
        sender.send(text);
    })
})
connectify_server.get('/Profile_Edit',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;
    sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Profile_Edit');

})
connectify_server.get('/Profile_pic',(required,sender)=>{
            console.log(required.query.user_id);
            Get_Profile(required.query.user_id,(record)=>{
                if(record==false){console.log("****Get_Profile Query generally failed!***\n"+record);}
                else{
                    sender.send(record);}
            })
})
connectify_server.get('/Post_Page',(required,sender)=>{
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    let user_name=Logged_Cookie.User[0];
    temp_id=user_id;
    temp_user=user_name;    
    sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Post_page')
})
connectify_server.get('/www.connectify.com/:temp_user:temp_id/Post_page',(required,sender)=>{
    sender.sendFile(web_htmlcss_path+'/web_postpage.html');
})
connectify_server.get('/get_pdata',(required,sender)=>{
            Get_PostAll((returnback)=>{
                    if(returnback==true){console.log("****Get_PostData Query generally failed!***\n");}
                    else{
                        sender.send(returnback);
                    }
            });
})
connectify_server.get('/read_txtp',(required,sender)=>{
    console.log(required.query.post_id);
    let txt_path=path.join(web_files_path+'/Post_files/'+required.query.user_name+required.query.user_id+'/',required.query.post_id+".txt");
    o_stream.readFile(txt_path,'utf-8',(error,text)=>{
            if(error){console.log("Error! reading the file\n"+error);}
        sender.send(text);
    })
})



/*Module Imports */
const {Login_Check,Registration,Registration_Check,Get_User,Insert_Data,Get_Post,Get_PostAll,Get_Profile} = require("./Connectify_Database.js");
/***************************POST requests******************* */
/*Login/Reg POST Requests*/
connectify_server.post('/www.connectify.com/Login_Check',(required,sender)=>{
       var email=required.body.email; var password=required.body.password; var check_flag=0;
        /*Running Login Check Query */
        Login_Check(email,password,(record)=>{
                if(record==false){console.log("\nLogin Query generally failed\n");}
                check_flag=record.map(lflag_obj => lflag_obj.lflag);
                if(check_flag[0]==1){
                    console.log("\nFor Debugging purpose Sucess Login with email: "+email+"\nPassword: "+password);
                    Get_User(email,password,(record)=>{
                        if(record==false){console.log("Get_User Query Generally faield!");}
                        let current_name=record.map(c_user_obj=>c_user_obj.user_name);
                        let current_id = record.map(c_user_obj=>c_user_obj.user_id);
                        temp_user=current_name;
                        temp_id=current_id;
                        sender.cookie('Logged_in_User',JSON.stringify({User:current_name,User_ID:current_id}),{maxAge:7200000,httpOnly: true});
                        sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Home_Page');
                        
                    })
                }else{
                    console.log("\nFor Debugging purpose Failed Login with email: "+email+"\nPassword: "+password)
                    sender.redirect('/www.connectify.com/');
                }
            })
})

connectify_server.post('/www.connectify.com/register_submission',(required,sender)=>{
    var user_name=required.body.username; var email=required.body.email; var password=required.body.password; var check_flag=0;
    var sucess_flag=false;
    console.log("**************LOGIN/REG CONSOLE LOGGING******************\n");
    Registration_Check(user_name,email,(record)=>{
        if(record==false){console.log("\nLogin Query generally failed\n");}
        check_flag=record.map(rflag_obj => rflag_obj.rflag);
        if(check_flag[0]==1){
            sucess_flag=true;
            console.log("\nUser already exists\n");
        }else{
            sucess_flag=false;
            Registration(user_name,email,password,(sucess)=>{
                if(!sucess){console.log("\nError running Registration Query!\n");}
                Get_User(email,password,(record)=>{
                    if(record==false){console.log("Get_User Query Generally faield!");}
                    let current_name=record.map(c_user_obj=>c_user_obj.user_name);
                    let current_id = record.map(c_user_obj=>c_user_obj.user_id);
                    sender.cookie('Logged_in_User',JSON.stringify({User:current_name,User_ID:current_id}),{maxAge:7200000,httpOnly: true});
                    temp_user=current_name;
                    temp_id=current_id
                    sender.redirect('/www.connectify.com/'+temp_user+temp_id+'/Profile_Edit');
                })
            })
            console.log("\nSuccessful Register!\n");
        }
    console.log("********************************************************\n");
    })
})

/*Profile Page/Edit POST Requests*/
connectify_server.post('/www.connectify.com/:temp_user:temp_id/submit_profile_edit',Saved_user.fields([{name: 'profile-image-upload',maxCount: 1},{name:'post-image-upload',maxCount: 1}]), async (required,sender)=>{
    let user_photo=required.files['profile-image-upload'];
    let user_post_img=required.files['post-image-upload'];
    let user_intro= required.body.introduction;
    let user_post_text=required.body.new_post;
    let Logged_Cookie=required.cookies.Logged_in_User;
    Logged_Cookie=JSON.parse(Logged_Cookie);
    let user_id=Logged_Cookie.User_ID[0];
    var user_name=Logged_Cookie.User[0];
    let rand_id=(Math.floor(Math.random()*(200-0)+1)+1);
    let profile_pic='default';
    /*CHECKING IF PROFILE_IMG input is left empty*/
    await new Promise((resolve,reject)=>{
            Get_Profile(user_id,(returnback)=>{
                console.log(returnback[0].profile_pic);
                    if(returnback[0].profile_pic=='default'){
                        profile_pic='default';
                  
                    }else{
                        profile_pic=returnback[0].profile_pic;
                    }   
            })
            resolve();
    });
    /*CHECKING IF INTRO input is left empty*/
    await new Promise((resolve,reject)=>{
        Get_Post(user_id,(returnback)=>{
           if(returnback.length<=0){
                if(!user_intro || user_intro==null || user_intro==''){
                    user_intro='Hello!';
                    resolve();
                }
           }
           else{
                    if(!user_intro || user_intro==null || user_intro==''){
                        user_intro=returnback[0].Introduction;
                        resolve();          
                    } 
           }
           resolve();    
        })
     
});
/*IF NULL Profile_Picture*/
    if(((user_photo==null || !user_photo) && profile_pic=='default')){
        if(user_post_text){
            let text_name=rand_id+'.txt';
            let text_path=path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',text_name);
            o_stream.writeFile(text_path,user_post_text,(error)=>{
            let post_type=".txt";
            let currentDate = new Date().toISOString().slice(0, 10); 
            console.log("\n Profile pic: "+profile_pic);
            Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                if(error==false){console.log("\nInsert Data Query Failed!\n");}
                sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');
            })
        })
        }else{
            um=path.extname(user_post_img[0].originalname);
            let img_name=rand_id+um;
            o_stream.rename(user_post_img[0].path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',img_name),(error)=>{
                if(error){
                    console.log("\nerror uploading image picture!\n");
                }else{
                    let currentDate = new Date().toISOString().slice(0, 10); 
                    post_type=um;
                    let profile_pic=user_name+upextension;
                    console.log("\n Profile pic: "+profile_pic);
                    Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                        if(error==false){console.log("\nInsert Data Query Failed!\n");}
                        sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');
                    })
                    }
                })
        }
    }
/*NOT NULL Profile_Picture*/
    else{
    let upextension;
    let newp;
        if(user_photo==null || !user_photo){
            upextension=path.extname(profile_pic);
            await new Promise((resolve,reject)=>{
            o_stream.readFile(web_files_path+'/Post_Files/'+user_name+user_id+'/'+profile_pic,(error,img)=>{
                if(error){console.log(error);}else{
                uphpic=img;
                uphpic.path=web_files_path+'/Post_Files/'+user_name+user_id+'/'+profile_pic;
                resolve();
                }
            });
        });
        }
        else{
        uphpic=user_photo[0];
        upextension=path.extname(uphpic.originalname);
        profile_pic =user_name+upextension;
        }
    if(user_post_text){
    o_stream.rename(uphpic.path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',user_name+upextension),(error)=>{
        if(error){
            console.log("\nerror uploading profile picture!\n");
        }else{
        let text_name=rand_id+'.txt';
        let text_path=path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',text_name);
        o_stream.writeFile(text_path,user_post_text,(error)=>{
                if(error){console.log("Error writing into text!"+error);}else{
                let post_type=".txt";
                let currentDate = new Date().toISOString().slice(0, 10); 
                
                console.log("\n Profile pic: "+profile_pic);
                Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                    if(error==false){console.log("\nInsert Data Query Failed!\n");}
                    sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');
                })
            }
         })
        }
        })
    } else{
        o_stream.rename(uphpic.path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',user_name+upextension),(error)=>{
            if(error){
                console.log("\nerror uploading profile picture!\n");
            }else{
            um=path.extname(user_post_img[0].originalname);
            let img_name=rand_id+um;
            o_stream.rename(user_post_img[0].path,path.join(web_files_path+'/Post_files/'+user_name+user_id+'/',img_name),(error)=>{
                if(error){
                    console.log("\nerror uploading image picture!\n");
                }else{
                    let currentDate = new Date().toISOString().slice(0, 10); 
                    post_type=um;
                    let profile_pic=user_name+upextension;
                    console.log("\n Profile pic: "+profile_pic);
                    Insert_Data(rand_id,user_id,post_type,currentDate,user_intro,profile_pic,(error)=>{
                        if(error==false){console.log("\nInsert Data Query Failed!\n");}
                        sender.redirect('/www.connectify.com/'+user_name+user_id+'/Home_page');
                    })
                    }
                })
                }
            })
    }
}

})












