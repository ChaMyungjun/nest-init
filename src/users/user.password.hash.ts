import { randomBytes, pbkdf2 } from 'crypto';

// create salt
const createSalt = () =>
  new Promise((resolve, reject) => {
    randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString('base64'));
    });
  });

// create user section
export const createHashedPassword = (plainPassword, passwordConfirm) =>
  new Promise(async (resolve, reject) => {
    const salt: any = await createSalt();
    console.log(plainPassword, passwordConfirm);
    if (plainPassword === passwordConfirm) {
      pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve({ password: key.toString('base64'), salt });
      });
    } else {
      resolve({ error: 'Password Does not math' });
    }
  });

// login user section
export const makePasswordHashed = (user, plainPassword) =>
  new Promise(async (resolve, reject) => {
    // salt를 가져오는 부분은 각자의 DB에 따라 수정
    // const salt = await models.user
    //   .findOne({
    //     attributes: ['salt'],
    //     raw: true,
    //     where: {
    //       userId,
    //     },
    //   })
    //   .then((result) => result.salt);
    pbkdf2(plainPassword, user.salt, 9999, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      resolve(key.toString('base64'));
    });
  });
