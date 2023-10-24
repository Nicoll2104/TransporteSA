<template>
        <div class="container">
            <div class="hero">
                <form action="" class="form">
                    <div class="imagenLogo"></div>
                    <div class="logo">Transporte</div>

                    <input type="email" name="email" id="email" required="" class="input" placeholder="Phone, email address or username">
                    <input type="password" name="password" id="password" required="" class="input" placeholder="Password">
                    
                    <button class="btn1" type="submit"><router-link to="/home">Acceder</router-link></button>
                    <p class="forgotten">Forgotten your login details ? <a href="#">Get help with signing in.</a></p>
                </form>
            </div>
        </div>
</template>


<script setup>

</script>


<style scoped>

.container {
    height: 100%;
    width: 100%;
}

.color1 {color: #0d1b25;}
.color2 {color: #143745;}
.color3 {color: #18596f;}
.color4 {color: #20869f;}
.color5 {color: #2bbbc9;}

.hero {
    padding: 60px 20px;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url("../assets/4931029.jpg");
    background-size:cover ;
}

.form{
    display: flex;
    width: 500px;
    height: 60%;
    background: linear-gradient(160deg, #a9babb, #9fb2b7);
    flex-direction: column;
    box-shadow: 20px 17px 50px rgb(90, 88, 88);
    border-radius: 15px;
    font-size: 1rem;
    align-items: center;

}

.input {
    margin-bottom: 20px;
    border-radius: 2rem;
    display: block;
    width: 70%;
    height: 10%;
    border: none;
    outline: none;
    color: rgb(161, 161, 161);
    font-size: inherit;
}


.btn1 {
    text-align: center;
    color: rgb(112, 112, 112);
    border-radius: 10px;
    cursor: pointer;
    border: 0;
    width: 25%;
}

.logo {
    font-size: 40px;
    color: rgb(255, 255, 255);
    font-weight: 600;
    margin: 10px;
}

.imagenLogo{
    border-radius: 20%;
    background-image: url(https://static.vecteezy.com/system/resources/thumbnails/007/794/726/small/travel-bus-illustration-logo-on-light-background-free-vector.jpg);
    background-size: cover;
    width: 100px;
    height: 100px;
}

::placeholder {
    color: rgb(161, 161, 161);
}

.forgotten {
    text-align: center;
    font-size: .8rem;
    width: 80%;
    color: rgb(255, 255, 255);
    margin: 15px 0;
}

a {
    color: inherit;
    font-weight: bold;
    text-decoration: none;
}


</style>
