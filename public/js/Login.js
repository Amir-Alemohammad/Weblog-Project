const passInput = document.getElementById('input-login');
const img = document.getElementById('visible-img');
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