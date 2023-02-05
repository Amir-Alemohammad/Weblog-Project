const passInput = document.getElementById('input-login');
const ConfirmPass = document.getElementById("inputConfirmPassword");
const img = document.getElementById('visible-img');
const img2 = document.getElementById("img");
ConfirmPass.addEventListener("keyup",() => {
    const ConfirmPassKey = ConfirmPass.value.length;
    if(ConfirmPassKey == 0){
        img2.style.display = "none";
    }else{
        img2.style.display ='inline';
        }
    });
passInput.addEventListener('keyup',() => {

    const passInputKey= passInput.value.length;

    if(passInputKey == 0){

        img.style.display ='none';


    }else{

        img.style.display ='inline';

    }
});

const loginForm = () => {
   const passInputType = passInput.getAttribute('type');
    if (passInputType == 'password') {
        passInput.setAttribute('type','text');
        img.setAttribute('src','/images/invisible-eye.png');
    } 
    else
    {
         passInput.setAttribute('type','password');
         img.setAttribute('src','/images/visible-eye.png');
         }
    }
    
    const ConfirmPassLogin = () => {
        const ConfirmPassInputType = ConfirmPass.getAttribute("type");
        if(ConfirmPassInputType == "password"){
            ConfirmPass.setAttribute("type","text");
            img2.setAttribute("src","/images/invisible-eye.png");
        }else{
            ConfirmPass.setAttribute("type","password");
            img2.setAttribute("src","/images/visible-eye.png");
        }
    }