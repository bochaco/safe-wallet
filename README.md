# SAFE Wallet: Easily accessing your personal items privately, safely and globally

![SAFE Wallet](src/img/logo-header-415x98.png)

## Motivation
As a traveller you need to carry a few personal items you cannot loose if you want to be able to access your money, e.g. credit cards and home-banking passwords, or perhaps you crypto-wallets keys.

This can be sometimes challenging since you may not want to leave them at the hotel/hostel, but if you otherwise carry them with you it can also be risky or just uncomfortable.

In addition to this, if you are booking things as you travel (e.g. as a backpacker), you need to use your passwords and credit card numbers on a daily basis, and you are requested to type your passwords, and specially your credit card numbers, over and over again. You can otherwise decide to risk it and store them in your mobile phone, or trust any cloud storage to keep them there, which in any case is not a good idea.

Even if you are not travelling but shopping and/or banking from home, it would be much easier to have all this type of information handy in your device, but safe and secure.

## Background
As mentioned above, many people decide to store their credit card numbers and/or passwords in their mobile, tablet, laptop, or email accounts, so they can easily access them when needed. E.g. lying down very comfortably in bed trying to book things online, when your wallet and personal items are inside a locker and not with you in that moment.

The approach that comes up to anyone's mind when thinking of how to solve this issue, it is to store this information in a text file, encrypt it, and upload the encrypted file onto any of the cloud services available today, like a cloud storage or even an online email account.

This probably sounds reasonably and fairly secure, although it's definitely not a good choice if you want this information to be easy to maintain and to retrieve. In order to retrieve the information you need to first download the encrypted file, which implies logging into the cloud service where you stored it, you then need to decrypt it locally, then open it with a text editor to finally be able to read or copy/paste the information you were looking for. But this is not all, you then need to make sure you delete the file from the local storage, which is tricky since the OS may not fully delete the data but just update the file tables to remove the file entry and not its actual content.

## Solution
In order to solve this problem, it's proposed to develop a web application deployed on the SAFE network which provides an extremely simple UX to manage this type of information, which takes care of storing and retrieving the data securely on the user's SAFE account.

By providing such an application, the user would only need to make sure it has a SAFE account and the SAFE browser installed in its mobile phone, tablet or laptop.

All the encryption/decryption tasks are automatically handled by the SAFE network, and the web application displays the information, so it can be not only viewed, but also maintained in a very friendly and intuitive manner.

## Using the available prototype

![SAFE Wallet](src/img/anita.png)

A prototype of the SAFE Wallet is available on the SAFE Network at `safe://safewallet.wow`, a live mockup is also available [here](https://bochaco.github.io).

For more information, or discussions, please see and participate in [this post in the SAFE Network forum](https://safenetforum.org/t/introducing-safe-wallet-app/11764?u=bochaco).

## Related projects

This application depends on the [safe-coins-wallet package](https://github.com/bochaco/safe-coins-wallet).

## License

General Public License (GPL), version 3 ([LICENSE](LICENSE))

Copyright (c) 2016-2018 Gabriel Viganotti <@bochaco>.

This file is part of the SAFE Wallet application.

The SAFE Wallet is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The SAFE Wallet is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
