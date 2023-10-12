<script>
    import axios from "axios";
    import "doodle.css/doodle.css";

    axios.defaults.withCredentials = true;

    let username = "";
    let errorMsg = "";

    async function handleLogin() {
        if (username === "") {
            errorMsg = "Đặc Vụ thì phải có !";
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
<div class="doodle-border doode main">
        <div class="welcome">F-STRANGERS</div>
        <div class="input">
            <form class="doodle">
                <input
                    bind:value={username}
                    type="text"
                    placeholder="ENTER YOUR NICKNAME"
                />
                <button on:click={handleLogin}>LOGIN</button><br />
            </form>
        </div>
</div>
{#if errorMsg !== ""}
    <p class="error-msg">{errorMsg}</p>
{/if}

<style>
    * {
        margin: 0;
        padding: 0;
        font-size: 100%;
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
    .input input{
        margin-right: 30px;
    }
</style>
