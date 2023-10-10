<script>
    import {onMount} from "svelte"
    import jwtDecode from "jwt-decode"
    let token = ''
    let userData = ''

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
<style>

</style>