<script>
    import { onMount } from "svelte";
    import jwtDecode from "jwt-decode";
    import { io } from "socket.io-client";
    import axios from "axios";
    import "doodle.css/doodle.css";
    axios.defaults.withCredentials = true;

    let token = "";
    let userData = "";
    let roomMate;
    const SEND_MESSAGE_EVENT = "send message";
    const END_CHAT_EVENT = "end chat";

    let roomName = "";
    let isConnected = false;
    let roomMateCheck = false;

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

        socket.on("connect", () => {
            console.log("connected");
            isConnected = true;
        });

        socket.on("connect_error", (error) => {
            if (error.message === "unauthorized") {
                window.location.href = "../";
            }
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
            isConnected = false;
        });

        socket.on(SEND_MESSAGE_EVENT, (msg) => {
            messages = [...messages, msg];
        });

        socket.on(END_CHAT_EVENT, () => {
            document.cookie = token + '=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.href = "../";
        });
    }

    async function fetchDatabase() {
        if (!token) {
            return;
        }
        try {
            let res = await axios.post("http://localhost:3000/messages", {
                roomId: userData.roomId,
            });
            if (res.data.code === 200) {
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

    async function handleDeleteChat() {
        try {
            let res = await axios.post("http://localhost:3000/chatRooms", {
                roomId: userData.roomId,
            });
        } catch (err) {
            let res = err.message;
            console.log(res);
        }
    }

    async function findRoomInfo(){
        try{
            let res = await axios.post("http://localhost:3000/chatRooms/info", {
                roomId: userData.roomId,
            });
            if (res.data.code === 200) {
                let roomInfo = res.data.data;
                console.log(roomInfo);
                console.log(userData.id);
                for (const item of roomInfo) {
                    if (item.userId !== userData.id) {
                        roomMate = item;
                    }
                }
                // console.log("roomate" );
                // console.log(roomMate);
                // console.log(userData);
                roomName = userData.roomName;
                // console.log(roomName);
                if (roomMate) {
                    roomMateCheck = true;
                }
            }
        } catch (err) {
            console.log(err);
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
        console.log("check:");
        console.log(userData);
        fetchDatabase();
        connectWebSocket();
        findRoomInfo();
        if (!token) {
            window.location.href = "../";
        }
    });
</script>

<!-- <link rel="stylesheet" href="doodle.css"/> -->
{#if isConnected}
<div class="container doodle doodle-border">
    <div class="top doodle doodle doodle-border">
        Đặc vụ "{userData.username}", xin chào ngài !
    </div>
    <div class="bot">
        <div class="bot-left doodle doodle-border">
            <div class="doodle content">
                {#each messages as msg}
                    <div class="line">
                        <div
                            class={"item doodle doodle-border " +
                                (msg.sender.id === userData.id
                                    ? "blue"
                                    : "red")}
                        >
                            {msg.content}
                        </div>
                    </div>
                {/each}
            </div>
                <div class="message-bottom doodle-border">
                    <form class="doodle message">
                        <input
                            class="chat doodle margin"
                            bind:value={messageContent}
                            bind:this={inputMessageDom}
                            type="text"
                            placeholder="Type message here"
                        />
                        <input
                            class="doodle margin"
                            on:click={handleSubmit}
                            type="submit"
                            value="Gửi Cho Ghệ Iu"
                        />
                    </form>
                </div>
        </div>
        <div class="bot-right doodle doodle-border">
            <div class="User doodle">Tên Phòng: {roomName}</div>
            {#if !roomMateCheck}
                <div class="User doodle">Bạn chưa có đối tác chat!</div>
            {/if}
            {#if roomMateCheck}
                <div class="User doodle">Bạn đang chat với: {roomMate.user.username}</div>
            {/if}
            <div>
                <input
                    id="endChat"
                    class="logout doodle"
                    on:click={handleDeleteChat}
                    type="submit"
                    value="End Chat"
                />
            </div>
        </div>
    </div>
</div>
{/if}


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
        height: 440px;
        overflow-y: auto;
    }
    .margin {
        margin-top: 6px;
        background-color: #fdf7f1;
    }
    .message {
        background-color: bisque !important;
        /* margin-top: 10px; */
    }
    .message-bottom {
        /* margin-top: 10px;
        height: 40px;
        margin-left: 10px;
        margin-right: 10px; */
        background-color: bisque;
        height: 70px;
        width: 1020px;
    }
    .chat {
        width: 850px;
        /* margin-right: 2px;
        margin-left: 5px; */
    }
    .line {
        width: auto;
        height: 38px;
        /* background-color: blue; */
        margin: 10px;
        margin-left: 0px;
        position: relative;
    }
    .item {
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
    /* .bot-right {
    } */
    .logout {
        margin: 0 auto;
        margin-top: 430px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28px;
        width: 200px;
        height: 60px;
    }
</style>
