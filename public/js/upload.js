const imageUpload = document.getElementById("imageUpload");

imageUpload.addEventListener("click",function(){

    
    
    let xhttp = new XMLHttpRequest(); //create new AJAX Request
    
    
    const selectedImage = document.getElementById("selectedImage");
    const imageStatus = document.getElementById("imageStatus");
    const progressDiv = document.getElementById("progressDiv");
    const progressBar = document.getElementById("progressBar");
    const uploadResult = document.getElementById("uploadResult");

    xhttp.onreadystatechange = function () {
        if(xhttp.status === 200){
            imageStatus.innerHTML = "آپلود عکس موفیقت آمیز بود";

            uploadResult.innerHTML = this.responseText;
            
        }else{
            
            imageStatus.innerHTML = this.responseText;
        }
    }
    xhttp.open("POST","/dashboard/image-upload");
    
    xhttp.upload.onprogress = function (event) {
        if(event.lengthComputable){
            
            let resault = Math.floor((event.loaded / event.total) * 100);
            if(resault != 100){
                progressBar.innerHTML = resault + "%";
                progressBar.style.width = resault + "%";
            }else{
                progressDiv.style.display = "none";
            }
        }
    }
   
    let formData = new FormData();
    
    if(selectedImage.files.length > 0){
        
        progressDiv.style.display = "block"; 

        formData.append("image",selectedImage.files[0]);
        
        xhttp.send(formData);
    }else{
        imageStatus.innerHTML = "برای آپلود باید عکسی انتخاب کنید";
    }
    
});