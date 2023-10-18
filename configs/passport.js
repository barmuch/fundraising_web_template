import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import User from '../models/user.js'

import tokenTypes from './tokens.js'
import config from './vars.js'

export default function passportInit() {
    const jwtOptions = {
        secretOrKey: config.jwt.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }

    const jwtVerify = async (payload, done) => {
        // try {
        //     // check token type
        //     if (payload.type !== tokenTypes.ACCESS) {
        //         throw new Error('Invalid token type')
        //     }
        //     // check if user exist
        //     const user = await User.findById(payload.sub)
        //     if (!user) {
        //         return done(null, false)
        //     }
        //     done(null, user)
        // } catch (error) {
        //     done(error, false)
        // }

        console.log(payload)

        return done(null, payload)
    }

    const googleOptions = {
        clientID: config.google_CLIENT_ID,
        clientSecret: config.google_CLIENT_SECRET,
        callbackURL: `${config.base_URL}/auth/redirect/google`,
        scope: ['profile', 'email'],
    }

    const googleVerify = async (accessToken, refreshToken, profile, done) => {
        // Check if the user already exists in your database
        try {
            const existingUser = await User.findOne({ googleId: profile.id })

            if (existingUser) {
                // User already exists, so log them in
                return done(null, existingUser)
            }

            // User doesn't exist, create a new user with Google data
            const newUser = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails[0].value,
                isEmailVerified: true,
                // Add more user data as needed
            })

            await newUser.save()
            return done(null, newUser)
        } catch (err) {
            return done(err)
        }
    }

    passport.use(new LocalStrategy(User.authenticate()))
    passport.use(new JwtStrategy(jwtOptions, jwtVerify))
    passport.use(new GoogleStrategy(googleOptions, googleVerify))

    passport.serializeUser(User.serializeUser())
    passport.deserializeUser(User.deserializeUser())
}
