const get_cookie=new XMLHttpRequest();
const get_data=new XMLHttpRequest();
const get_post=new XMLHttpRequest();
const get_request=new XMLHttpRequest();
const set_profile=new XMLHttpRequest();


get_cookie.open("GET",'/get_cookie');
get_data.open("GET",'/home_page');
get_data
get_cookie.send();
get_data.send();
var user_id;
var user_name;
var title_user=document.getElementById('username');
var user_path='/web_files/Post_files/';
get_cookie.onload= async function(){
await new Promise((resolve,reject)=>{
    let logged_data=JSON.parse(get_cookie.responseText);
     user_id=logged_data.User_ID[0];
     user_name=logged_data.User[0];
     resolve();
    })
}

get_request.open("GET",'/get_requests');
get_request.send();
get_request.onload=async function(){
    let pdiv=document.getElementById('R_b');
    let cdiv=pdiv.querySelector('.User_request');
   
    cdiv.remove();
    let convert_data=JSON.parse(get_request.responseText);
    for (let i=0;i<convert_data.length;i++){
        pdiv.querySelector('.no_pending').textContent="";
        var new_request=cdiv.cloneNode(true);
        let user_name=convert_data[i].user_name;
        let profile_pic=convert_data[i].profile_pic;
        let request_sender=convert_data[i].request_sender;
        new_request.querySelector('.sender_name').textContent=user_name;
        new_request.querySelector('.sender_img').src='/web_files/Post_files/'+user_name+request_sender+'/'+profile_pic;   
        new_request.querySelector('.r_id').textContent=request_sender;
        new_request.style.display="flexbox";
        pdiv.appendChild(new_request);
        void new_request.offsetWidth;
        new_request.style.pointer="auto";
        new_request.style.opacity=1;
        new_request.style.top='25%';
        new_request.style.margin_top='55px';
    }
}





get_data.onload= async function(){
    let convert_data=JSON.parse(get_data.responseText);
    console.log(convert_data);
    document.getElementById('username').textContent=user_name;
    document.getElementById('introduction').textContent=convert_data[convert_data.length-1].Introduction;
    set_profile.open("GET",'/Profile_pic?user_id='+user_id);
    set_profile.send();
    /*Getting Profile Picture*/
    await new Promise((resolve,rejects)=>{
    set_profile.onload=function(){
    let convert_data=JSON.parse(set_profile.responseText);
    console.log(convert_data[0].profile_pic)
        if(convert_data[0].profile_pic=='default'){
            document.getElementById('profile_picture').src="/web_files/web_images/default_logo.PNG";
            resolve();
        }else{
            document.getElementById('profile_picture').src='/web_files/Post_files/'+user_name+user_id+'/'+convert_data[0].profile_pic;
            resolve();
        }
    }
    });
    for(let i=0;i<convert_data.length;i++){
        let Like_count=convert_data[i].Like_count
        let Reply_count=convert_data[i].Reply_count
        let post_date=convert_data[i].post_date;
        console.log(i);
        let post_type=convert_data[i].post_type;
        console.log(post_type)
        console.log(convert_data[i].post_id);
        var post_id=convert_data[i].post_id;
            if(post_type==".txt"){
                var clone_p_text=document.getElementById('p_switch').cloneNode(true);
                var home_text=clone_p_text.querySelector('.Home_Post_Text');
                var txt_post;
                get_post.open("GET",'/read_txt?post_id='+post_id);
                get_post.send();
                await new Promise((resolve, reject) => {
                    get_post.onload = function () {
                        txt_post = get_post.responseText;
                        console.log(txt_post);
                        console.log(convert_data[i].post_date);
                        home_text.querySelector(".commentbutton").innerHTML='<i class="far fa-comment"></i> Comment ('+Reply_count+')';
                        home_text.querySelector(".like").innerHTML ='<i class="far fa-thumbs-up"></i> Like! ('+Like_count+')';
                        home_text.querySelector(".post_id").textContent=convert_data[i].post_id
                        home_text.querySelector(".post_date").textContent = convert_data[i].post_date;
                        home_text.querySelector(".p_txt").textContent = txt_post;
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
                home_img.querySelector(".commentbutton").innerHTML='<i class="far fa-comment"></i> Comment ('+Reply_count+')';
                home_img.querySelector(".like").innerHTML ='<i class="far fa-thumbs-up"></i> Like! ('+Like_count+')';
                home_img.querySelector(".post_id").textContent=convert_data[i].post_id
                home_img.querySelector(".post_date").textContent=convert_data[i].post_date;
                home_img.querySelector(".Post_Image").src="/web_files/Post_files/"+user_name+user_id+"/"+convert_data[i].post_id+convert_data[i].post_type;
                home_img.style.display="flex";
                clone_p_img.style.display="flex";
                document.body.appendChild(clone_p_img);
        } 
    }
}
