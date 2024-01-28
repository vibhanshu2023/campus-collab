import express from "express";
import multer from 'multer';
import Profile from '../models/profileModel.js';
import LoginData from '../models/login.js';
import cors from 'cors';
const app=express(); 
const router = express.Router();

//to store photo 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'D:/Kriti_manas_webCollab/backend/models/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


router.get('/', (req, res) => {
    res.send("Manas website is live");
});

router.post('/upload', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully.');
});

// router.post('/upload', upload.single('photo'), async (req, res) => {
//     try {
//         const { name, email, age, institute, branch } = req.body;
//         const profile = new Profile({
//             photo: req.file ? req.file.path : null,
//             name,
//             email,
//             age,
//             institute,
//             branch
//         });
//         await profile.save();


//         res.send('Profile created successfully.');
//     } catch (error) {

//         console.error('Error creating profile:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
router.post("/profile",async(req,res)=>{
    try {
        const { name, email, age, institute, branch } = req.body;
        const profile = new Profile({
            // photo: req.file ? req.file.path : null,
            name,
            email,
            age,
            institute,
            branch
        });
        await profile.save();


        res.send('Profile created successfully.');
    } catch (error) {

        console.error('Error creating profile:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.use(cors());
  

app.post('/api/login', async (req, res) => {
  try {
    const loginResponse = req.body;
    

    const loginData = new LoginData({ loginResponse });
    await loginData.save();

    res.status(201).send('Login data stored successfully');
  } catch (error) {
    console.error('Error storing login data:', error);
    res.status(500).send('Internal server error');
  }
});

export default router;