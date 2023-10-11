<script>
    
    import {onMount} from "svelte"
    import jwtDecode from "jwt-decode"
    import { io } from 'socket.io-client'
    import axios from 'axios'
    axios.defaults.withCredentials = true

    let token = ''
    let userData = ''
    const SEND_MESSAGE_EVENT = 'send message'

    let roomName = ''
    let isConnected = false

    let inputMessageDom
    let messages = []
    let messageContent = ''
    let socket

    function handleSubmit() {
        const message = {
            content: messageContent,
            sender: userData
        }

        socket.emit(SEND_MESSAGE_EVENT, messageContent)
        //Gửi message đến sự kiện SEND_MASSAGE
        messages = [...messages, message]

        messageContent = ''
        setTimeout(() => {
            inputMessageDom.focus()
        }, 10)
    }

    function connectWebSocket() {
        socket = io.connect('ws://localhost:3000', {
            query: {
                token: token
            }
        })
        /** Token   
         * - id
         * - username
         * - roomId
        */
        console.log(socket.connected)

        socket.on('connect', () => {
            console.log('connected')
            isConnected = true
        })

        socket.on('connect_error', error => {
            if (error.message === 'unauthorized') {
                window.location.href = '/login'
            }
        })

        socket.on('disconnect', () => {
            console.log('disconnected')
            isConnected = false
        })

        socket.on(SEND_MESSAGE_EVENT, msg => {
            messages = [...messages, msg]
        })
    }

    onMount(() => {
        let cookie = new Map(
            document.cookie
                .split(';')
                .map(each => each.trim().split('='))
        )
        token = cookie.get('token')
        userData = jwtDecode(token)
        connectWebSocket()
    })
</script>
<h1>
    chatRoom Ne
</h1>
<h1>Xin chào `{userData.username}`</h1>
<h2>Room: `{userData.roomId}`</h2>

{#if isConnected}
    <p>Room name: <b>{userData.roomId}</b></p>
    <form>
        <input bind:value={messageContent} bind:this={inputMessageDom} type="text" placeholder="Type message here">
        <input on:click={handleSubmit} type="submit">
    </form>
    {#each messages as msg}
        <div>
            <span class={"msg-sender " + (msg.sender.id === userData.id ? 'blue' : 'red')}>
                {msg.sender.username}: </span>
            <span class="msg-content">{msg.content}</span>
        </div>
    {:else}
        <p>There is no message</p>
    {/each}
{/if}

<style>
    .msg-sender {
        font-weight: bold;
    }
    .blue {
        color: blue;
    }
    .red {
        color: red;
    }
</style>