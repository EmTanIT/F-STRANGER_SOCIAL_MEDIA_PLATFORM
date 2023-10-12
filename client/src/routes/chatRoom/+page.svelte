<script>
    import { onMount } from "svelte";
    import jwtDecode from "jwt-decode";
    import { io } from "socket.io-client";
    import axios from "axios";
    import "doodle.css/doodle.css";
    axios.defaults.withCredentials = true;

    let token = "";
    let userData = "";
    const SEND_MESSAGE_EVENT = "send message";

    let roomName = "";
    let isConnected = false;

    let inputMessageDom;
    let messages = [];
    let messageContent = "";
    let socket;

    function handleSubmit() {
        const message = {
            content: messageContent,
            sender: userData,
        };

        socket.emit(SEND_MESSAGE_EVENT, messageContent);
        //Gửi message đến sự kiện SEND_MASSAGE
        messages = [...messages, message];

        messageContent = "";
        setTimeout(() => {
            inputMessageDom.focus();
        }, 10);
    }

    function connectWebSocket() {
        socket = io.connect("ws://localhost:3000", {
            query: {
                token: token,
            },
        });
        console.log(socket.connected);

        socket.on("connect", () => {
            console.log("connected");
            isConnected = true;
        });

        socket.on("connect_error", (error) => {
            if (error.message === "unauthorized") {
                window.location.href = "/login";
            }
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
            isConnected = false;
        });

        socket.on(SEND_MESSAGE_EVENT, (msg) => {
            messages = [...messages, msg];
        });
    }

    async function fetchDatabase() {
        console.log(userData);
        if (!token) {
            return;
        }
        try {
            let res = await axios.post("http://localhost:3000/messages", {
                roomId: userData.roomId,
            });
            if (res.data.code === 200) {
                console.log(res);
                let messageList = res.data.data;
                console.log(messageList);
                messages = [...messages, ...messageList];
            }
            console.log(messages);
        } catch (err) {
            let res = err.message;
            console.log(res);
        }
    }

    onMount(() => {
        let cookie = new Map(
            document.cookie.split(";").map((each) => each.trim().split("="))
        );
        token = cookie.get("token");
        userData = jwtDecode(token);
        fetchDatabase();
        connectWebSocket();
    });
</script>

<link rel="stylesheet" href="doodle.css" />
<div class="container doodle doodle-border">
    <div class="top doodle doodle doodle-border">
        Đặc vụ "{userData.username}", xin chào ngài !
    </div>
    <div class="bot">
        <div class="bot-left doodle doodle-border">
            <div class="doodle doodle-border content">
                {#each messages as msg}
                    <div class= "line">
                        <div class= { "item doodle doodle-border " +
                        (msg.sender.id === userData.id
                            ? "blue"
                            : "red")}>
                        {msg.content}
                        </div>
                        <!-- <span
                            class={"msg-sender " +
                                (msg.sender.id === userData.id
                                    ? "blue"
                                    : "red")}
                        >
                            {msg.sender.username}:
                        </span> -->
                        <!-- <span class="msg-content">{msg.content}</span> -->
                    </div>
                {/each}
            </div>
            {#if isConnected}
                <form class="doodle message">
                    <input
                        class="chat doodle"
                        bind:value={messageContent}
                        bind:this={inputMessageDom}
                        type="text"
                        placeholder="Type message here"
                    />
                    <input
                        class="doodle"
                        on:click={handleSubmit}
                        type="submit"
                        value="Gửi Cho Ghệ Iu"
                    />
                </form>
            {/if}
        </div>
        <div class="bot-right doodle doodle-border">haha</div>
    </div>
</div>

<!-- <h1>chatRoom Ne</h1>
<h2>Room: `{userData.roomId}`</h2>

{#if isConnected}
    <p>Room name: <b>{userData.roomId}</b></p>
    <form>
        <input
            bind:value={messageContent}
            bind:this={inputMessageDom}
            type="text"
            placeholder="Type message here"
        />
        <input on:click={handleSubmit} type="submit" />
    </form>
{/if}
 -->

<style>
    @import url("https://fonts.googleapis.com/css2?family=Short+Stack&display=swap");
    * {
        margin: 0;
        padding: 0;
        font-size: 100%;
        font-family: "Short Stack", cursive;
    }
    .container {
        margin: 0 auto;
        margin-top: 25px;
        height: 90vh;
        width: 95%;
    }
    .top {
        margin-top: 10px;
        margin-left: 10px;
        width: 500px;
        font-size: 20px;
        padding-left: 10px;
        font-family: "Short Stack", cursive;
    }
    .bot {
        margin-left: 30px;
        margin-right: 30px;
        margin-top: 30px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: space-between;
        height: 550px;
    }
    .bot-left {
        width: 75%;
    }
    .bot-right {
        width: 22%;
    }
    .content {
        margin: 10px;
        height: 460px;
        overflow-y: auto;
        
    }
    .message {
        /* margin-top: 10px; */
        margin-top: 10px;
        height: 40px;
        margin-left: 10px;
        margin-right: 10px;
        
    }
    .chat {
        width: 850px;
    }
    .line{
        width: auto;
        height: 38px;
        /* background-color: blue; */
        margin: 10px;
        position: relative;
    }
    .item{
        height: 38px;
        width: auto;
        
    }
    .blue {
        /* color: blue; */
        position: absolute;
        left: 10px;
        padding-left: 10px;
        padding-right: 30px;
    }
    .red {
        /* color: red; */
        position: absolute;
        right: 10px;
        padding-right: 10px;
        padding-left: 30px;
    }
</style>
