// import { User } from '../../../model.js';

// export default async (req, res) => {
//   if (req.method !== 'POST') {
//     res.status(405).end(); // Method Not Allowed
//     return;
//   }

//   const { email, password, passwordconfirmation } = req.body;

//   if (password !== passwordconfirmation) {
//     res.end(
//       JSON.stringify({ status: 'error', message: 'Passwords do not match' })
//     );
//     return;
//   }

//   try {
//     const user = await User.create({ email, password });
//     res.send(JSON.stringify({ status: 'success', message: 'User added' }));
//   } catch (error) {
//     res.statusCode = 500;
//     let message = 'An error occurred';
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       message = 'User already exists';
//     }
//     res.send(JSON.stringify({ status: 'error', message }));
//   }
// };
