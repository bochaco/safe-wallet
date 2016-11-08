# SAFE Pocket: Easily accessing your personal items privately, safely and globally

## Introduction
As a traveller you need to carry a few personal items that you cannot loose if you want to be able to access your money, e.g. credit cards and homebanking passwords, or perhaps you crypto-wallets keys.

This can be sometimes challenging since you may not want to leave them at the hotel/hostel, but if you otherwise carry them with you it can also be risky or just uncomfortable.

In addition to this, if you are booking things as you travel (e.g. as a backpacker), you need to use your passwords and credit card numbers on a daily basis, and you are requested to type your passwords, and specially, your credit card numbers over and over again, unless you decide to risk it and store them in your mobile phone or trust any cloud storage to keep them there, which in any case is not a good idea.

## Background
As mentioned above, many people decide to store their credit card numbers and/or passwords in their mobile, tablet, laptop, or email accounts, so they can easily access them when needed. E.g. laying down very comfortably in bed trying to book things online, when your wallet and personal items are inside a locker and not with you in that moment.

The approach that comes up to anyone's mind when thinking of how to solve this issue, it is to store this information in a text file, encrypt it, and upload the encrypted file onto any of the cloud services available today, like a cloud storage or even an online email account.

This probably sounds reasonably and fairly secure, although it's definitely not a good choice if you want this information to be easy to maintain and to retrieve. In order to retrieve the information you need to first download the encrypted file, which implies logging into the cloud service where you stored it, you then need to decrypt it locally, then open it with a text editor to finally be able to read or copy/paste the information you were looking for. But this is not all, you then need to make sure you delete the file from the local storage, which is tricky since the OS may not fully delete the data but just update the file tables to remove the file entry but not its actual content.

## Solution
In order to solve this problem, it's proposed to develop a web application deployed on the SAFE network which provides an extremely simple and easy to use UX to manage this type of information, which takes care of storing and retrieving the data securely on the user's SAFE account.

By providing such an application, the user would only need to make sure it has a SAFE account and the SAFE browser installed in its mobile phone, tablet or laptop.

All the encryption/decryption tasks are automatically handled by the SAFE network, and the web application displays the information so it can be copied/pasted, as well as edited, in a very friendly manner.

![Mockup of mobile app](img/mockup.png)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
