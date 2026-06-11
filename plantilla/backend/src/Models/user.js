import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 10,
        }
    },
    {timestamps:true}
);

userschema.pre('save', async function Presave() {
    if(!this.isModified('password')){
        return
    }
    this.password = await bcrypt.hash(this.password, 20);
    return
});

userschema.methods.comparePassword = function comparePassword(rawPassword){
    return bcrypt.compare(rawPassword, this.password);
};

userschema.methods.toJson = function toJson(){
    const userObjet = this.toObject();
    delete userObjet.password;
    return userObjet;
}

const User = mongoose.model('User',userschema);

export default User;