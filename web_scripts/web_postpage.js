
const get_cookie=new XMLHttpRequest();
const get_pdata= new XMLHttpRequest();
const get_post=new XMLHttpRequest();
get_cookie.open("GET",'/get_cookie');
get_cookie.send();
get_pdata.open("GET",'/get_pdata');
get_pdata.send();


var current_user;
var current_uid;

let get_fdata=new XMLHttpRequest();
get_fdata.open("GET",'/get_fdata');
get_fdata.send();
get_fdata.onload=  async function(){
  let pdiv=document.getElementById('f_s');
  let cdiv=pdiv.querySelector('.Friends_List');
  let convert_data=JSON.parse(get_fdata.responseText);
  for(let i=0;i<convert_data.length;i++){
    var cloned_fl=cdiv.cloneNode(true);
    let friend_id=convert_data[i].friend_id;
    let friend_name=convert_data[i].user_name;
    let profile_pic=convert_data[i].profile_pic;
    let online_status=convert_data[i].online;
    cloned_fl.querySelector('.Friend_img').src='/web_files/Post_files/'+friend_name+friend_id+'/'+profile_pic;
    if(online_status==0){
      cloned_fl.querySelector(".online_status").style.backgroundColor='rgba(128, 128, 128, 0.74)';
    }
    cloned_fl.querySelector('.Friend_Name').textContent=friend_name;
    cloned_fl.querySelector('.friend_id').textContent=friend_id;
    cloned_fl.style.display='flex';
    pdiv.appendChild(cloned_fl);
  }
}





get_cookie.onload = async function(){
   let  logged_data=JSON.parse(get_cookie.responseText);
   current_uid=logged_data.User_ID[0];
   current_user=logged_data.User[0];
   let main_container=document.getElementById('mc');
   let main_left=main_container.querySelector('.main_left');
   let profile_div=main_left.querySelector('.profile-picture');
   let profile_namediv=main_left.querySelector('.profile-handle');
   let set_profile=new XMLHttpRequest();
   set_profile.open("GET",'/Profile_pic?user_id='+current_uid);
   set_profile.send();
   /*Getting Profile Picture*/
   await new Promise((resolve,reject)=>{
         set_profile.onload=function(){
            let convert_data=JSON.parse(set_profile.responseText);
            console.log(convert_data[0].profile_pic)
               if(convert_data[0].profile_pic=='default'){
                  profile_div.querySelector('.myp').src="/web_files/web_images/default_logo.PNG";
                  profile_namediv.querySelector('.mpn').textContent=current_user;
                  resolve();  
       }
       else{
               profile_div.querySelector('.myp').src='/web_files/Post_files/'+current_user+current_uid+'/'+convert_data[0].profile_pic;
               profile_namediv.querySelector('.mpn').textContent=current_user;
               resolve();  
       }
   }
         resolve();   
   });

}









get_pdata.onload=async function(){
   let convert_data=JSON.parse(get_pdata.responseText);
   console.log(convert_data);
  for(let i=0;i<convert_data.length;i++){
     let user_id=convert_data[i].user_id;
     let user_name=convert_data[i].user_name;
     let post_id=convert_data[i].post_id;
     let Like_count=convert_data[i].Like_count
     let Reply_count=convert_data[i].Reply_count
     let post_date=convert_data[i].post_date;
     let post_type=convert_data[i].post_type;
     let profile_pic=convert_data[i].profile_pic;
  
      if(post_type==".txt"){
         var clone_p_text=document.getElementById('p_switch').cloneNode(true);
         var home_text=clone_p_text.querySelector('.Home_Post_Text');
         var txt_post;
         get_post.open("GET",'/read_txtp?post_id='+post_id+"&user_name="+user_name+"&user_id="+user_id);
         get_post.send();
         await new  Promise((resolve, reject) => {
             get_post.onload = async function () {
                 txt_post = get_post.responseText;
                 console.log(txt_post);
                 console.log(post_date);
                 let set_profile=new XMLHttpRequest();
                 set_profile.open("GET",'/Profile_pic?user_id='+user_id);
                 set_profile.send();
                 /*Getting profile_picture*/
                 await new Promise(async(resolve,rejects)=>{
                  set_profile.onload=function(){
                  let convert_data=JSON.parse(set_profile.responseText);
                  console.log(profile_pic)
                      if(profile_pic=='default'){
                        home_text.querySelector(".post_profile_img").src="/web_files/web_images/default_logo.PNG";
                          resolve();
                      }else{
                        home_text.querySelector(".post_profile_img").src='/web_files/Post_files/'+user_name+user_id+'/'+profile_pic;
                          resolve();
                      }
                  }
                  });
                  home_text.querySelector(".commentbutton").innerHTML='<i class="far fa-comment"></i> Comment ('+Reply_count+')';
                  home_text.querySelector(".like").innerHTML ='<i class="far fa-thumbs-up"></i> Like! ('+Like_count+')';
                  home_text.querySelector(".post_id").textContent=convert_data[i].post_id;
                  home_text.querySelector(".post_date").textContent =post_date;
                  home_text.querySelector(".p_txt").textContent = txt_post;
                  home_text.querySelector(".post_user").textContent=user_name;
                 home_text.style.display = "flex";
                 clone_p_text.style.display = "flex";
                 document.body.appendChild(clone_p_text);
                 resolve();
             }
         });
     }
     else {
         var clone_p_img = document.getElementById('p_switch').cloneNode(true);
         var home_img=clone_p_img.querySelector('.Home_Post_Img');
         home_img.querySelector(".post_date").textContent=convert_data[i].post_date;
         let set_profile=new XMLHttpRequest();
         set_profile.open("GET",'/Profile_pic?user_id='+user_id);
         set_profile.send();
         await new Promise((resolve,rejects)=>{
            set_profile.onload=function(){
            let convert_data=JSON.parse(set_profile.responseText);
            console.log(profile_pic)
                if(profile_pic=='default'){
                  home_img.querySelector(".post_profile_img").src="/web_files/web_images/default_logo.PNG";
                    resolve();
                }else{
                  home_img.querySelector(".post_profile_img").src='/web_files/Post_files/'+user_name+user_id+'/'+profile_pic;
                    resolve();
                }
            }
            });
          home_img.querySelector(".commentbutton").innerHTML='<i class="far fa-comment"></i> Comment ('+Reply_count+')';
          home_img.querySelector(".like").innerHTML ='<i class="far fa-thumbs-up"></i> Like! ('+Like_count+')';
          home_img.querySelector(".post_id").textContent=convert_data[i].post_id;
          home_img.querySelector(".Post_Image").src="/web_files/Post_files/"+user_name+user_id+"/"+post_id+post_type;
          home_img.querySelector(".post_user").textContent=user_name;
          home_img.style.display="flex";
          clone_p_img.style.display="flex";
          document.body.appendChild(clone_p_img);
    }
    
    

}}


