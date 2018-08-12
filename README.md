## Rocket

Rocket is an encrypted URL Shortener. It hashes the short URL locally on the user's computer and decrypts the returned data locally with the short link as key.

## Motivation

I like URL shorteners, and I wanted one of my own. At the same time, I want to protect the user's data and avoid having to know what the users share (for liabilities reasons).
Of course, the entropy given by the short link is not enough to provide proper security; I will be working to solve this issue later using different techniques

## Requirements

This application can be hosted on a nginx server; but it requires the backend server [LaunchPad](https://github.com/stefanovazzocell/LaunchPad/)

## Contributors

You are welcome to try to improve the code. For any question, contact stefanovazzocell@gmail.com.

## License

This code is distributed under the Apache 2.0 license.
[NJQ](https://github.com/stefanovazzocell/NJQ) (Apache 2.0), [Furtive](https://github.com/johno/furtive) (MIT), and [SJCL](https://github.com/bitwiseshiftleft/sjcl) (GNU GPL 2.0) are used in this program.



## Versions
Rocket follows tentatively [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).
