<script>
    import axios from "axios";
    import 'doodle.css/doodle.css'

    axios.defaults.withCredentials = true;

    let username = "";
    let errorMsg = "";

    async function handleLogin() {
        if (username === "") {
            errorMsg = "Đặc Vụ thì phải có Mật Danh !";
            console.log(errorMsg);
            setTimeout(() => {
                errorMsg = "";
                console.log(errorMsg);
            }, 3000);
            return;
        }

        try {
            let res = await axios.post("http://localhost:3000/users", {
                username: username,
            });
            console.log(res);
            if (res.data.code === 200) {
                window.location.href = "http://localhost:5173/chatRoom";
            }
        } catch (err) {
            let res = err.response;
            console.log(res);
            errorMsg = res.data.message;
            console.log(res.data);
        }
    }

</script>
<link rel="stylesheet" href="doodle.css" />
<div class="doodle-border doodle main">
    <div class="welcome">F-STRANGERS</div>
    <div class="input">
        <form class="doodle">
            <input
                bind:value={username}
                type="text"
                placeholder="Nhập Mật Danh Của Bạn !"
            />
            <button on:click={handleLogin}>Tìm Ghệ</button><br />
        </form>
    </div>
</div>
{#if errorMsg !== ""}
    <div class="message doodle doodle-border">{errorMsg}</div>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Short+Stack&display=swap");
    * {
        margin: 0;
        padding: 0;
        font-size: 100%;
        font-family: "Short Stack", cursive;
    }
    .main {
        margin: 0 auto;
        margin-top: 25px;
        height: 90vh;
        width: 90%;
    }
    .welcome {
        font-family: "Short Stack", cursive;
        font-size: 150px;
        text-align: center;
        margin-top: 210px;
    }
    .input {
        margin-top: 70px;
        display: flex;
        justify-content: center;
        
    }
    .input input {
        margin-right: 30px;
        padding-right: 10px;
        width: 300px;
    }
    .message {
        /* background-color: #3498db;
        color: #fff; */
        padding: 10px;
        position: fixed;
        top: 50px;
        right: 20px;
        /* border-radius: 5px; */
        font-family: "Short Stack", cursive;
        animation: slide-in 0.5s ease-in-out;
    }

    @keyframes slide-in {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
</style>
