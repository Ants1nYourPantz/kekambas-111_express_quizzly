// const { User } = require('../../models')
// const bcrypt = require('bcrypt')
const axios = require('axios');



module.exports = async (req, res) => {
    // console.log(req.body);
    // First check if that passwords match
    if (req.body.password !== req.body.confirmPass){
        res.status(400).send({ error: "Your passwords do not match" })
    } else {
        // // Get the data from the request body
        // const { username, email, password } = req.body
        // // Hash and salt the password before storing
        // const passwordHash = await bcrypt.hash(password, 10);
        // // Create a new instance of User
        // const user = new User({ username, email, password: passwordHash })
        // try{
        //     await user.save();
        //     res.send(`New User Created - ${user.username}`);
        // } catch (err){
        //     console.log(err);
        //     res.send('There was an issue')
        // }
        try {

            const mutation = `
                mutation ($username: String!, $email: String!, $password: String!){
                    register(
                        username: $username
                        email: $email
                        password: $password
                    )
                }
            `

            const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
                    {
                        query: mutation,
                        variables: {
                            username: req.body.username,
                            email: req.body.email,
                            password: req.body.password
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )

            const jwtoken = data.data.register;
            res.cookie('jwtoken', jwtoken, { httpOnly: true });
            res.redirect('/');

        } catch(err){
            console.log(err)
            res.redirect('/auth/register')
        }
    }
}