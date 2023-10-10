<script>
    import axios from "axios"
    import cors from "cors"
    
    axios.defaults.withCredentials = true


    let username = ''
    let errorMsg = ''

    async function handleLogin() {
        if (username === '') {
            errorMsg = 'Sát thủ thì phải có mật danh !'
            return
        }

        try {
            let res = await axios.post('http://localhost:3000/users', {
                username: username,
            })
            console.log(res);
            if (res.data.code === 200) {
                window.location.href = '/'
            }
        } catch(err) {
            let res = err.response
            console.log(res);
            // errorMsg = res.data.message
            // console.log(res.data)
        }
    }
</script>
<h1>Welcome to F-Strangers</h1>
<form>
    <input bind:value={username} type="text" placeholder="Enter username">
    <button on:click={handleLogin}>Login</button><br>
</form>
{#if errorMsg !== ''}
    <p class="error-msg">Error: {errorMsg}</p>
{/if}
<style>
    
</style>