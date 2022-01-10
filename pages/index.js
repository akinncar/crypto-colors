import React, { useState, useEffect, Fragment } from "react";
let Web3 = require("web3");
import Image from 'next/image'
import Swal from 'sweetalert2'

function Index() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(0);
  const [maxMintable, setMaxMintable] = useState(0);
  const [supply, setSupply] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [colors, setColors] = useState([])
  const [canSeeColors, setCanSeeColors] = useState(false);
  const imagesIndex = [
    {
      id: 'ts',
      title: '#0 TS Color',
      description: 'An distinguish TypeScript color'
    },
    {
      id: 'csharp',
      title: '#1 C# Color',
      description: 'An distinguish C# color'
    }, 
    {
      id: 'c++',
      title: '#2 C++ Color',
      description: 'An distinguish C++ color'
    },
    {
      id: 'js',
      title: '#3 JS Color',
      description: 'An distinguish JavaScript color'
    },
    {
      id: 'node',
      title: '#4 Node Color',
      description: 'An distinguish Node.js color'
    },
    {
      id: 'php',
      title: '#5 PHP Color',
      description: 'An distinguish PHP color'
    },
    {
      id: 'python',
      title: '#6 Python Color',
      description: 'An distinguish Python color'
    },
    {
      id: 'ruby',
      title: 'Ruby Color',
      description: 'An distinguish Ruby color'
    }
  ]

  let abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "claim",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "newBase",
          "type": "string"
        }
      ],
      "name": "setBaseURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "setDepositAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newURI",
          "type": "string"
        }
      ],
      "name": "setTokenURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "baseUrl",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "depositAddress",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxMintable",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  let contractAddress = "0x05E90E32ab55CbD75767C7863306471bCbF75d5e"; // change here

  function connectWallet(){
    if(!window.ethereum){
      alert("Please install MetaMask");
      setIsReady(false);
      return;
    }
    
    ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAddress(accounts[0]);
          let w3 = new Web3(ethereum);
          setWeb3(w3);
          let c = new w3.eth.Contract(abi, contractAddress);
          setContract(c);

          c.methods
            .totalSupply()
            .call()
            .then((supply) => {
              setIsReady(true);
              setSupply(supply);
            })
            .catch((err) => {
              setIsReady(false);
              setAddress(null);
              setSupply(0);
              setBalance(0);
              setMaxMintable(0);
              setContract(null);
              Swal.fire({
                title: 'Error!',
                html: 'Check if you are using the Fantom Network',
                icon: 'error',
                confirmButtonText: 'Ok'
              })
              console.log(err)
            });

          c.methods
            .maxMintable()
            .call()
            .then((maxMintable) => {
              setMaxMintable(maxMintable);
            })
            .catch((err) => console.log(err));

          c.methods
            .balanceOf(accounts[0])
            .call()
            .then((_balance) => {
              setBalance(_balance);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          setIsReady(false);
          Swal.fire({
            title: 'Error!',
            html: 'Check if you are using the Fantom Network',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
          console.log(err)
        })      
  }

  function handleClaim() {
    let tx = claim();
    console.log(tx);
  }

  const showColorsFromPerson = async () => {
    const totalSupply = await contract.methods.totalSupply().call()
    const owners = []

    for (let i = 0; i < totalSupply; i++) {
      const accountAddress = await contract.methods.ownerOf([i]).call()
      
      if (accountAddress.toLowerCase() == address.toLowerCase())
        owners.push({ accountAddress: imagesIndex[i] }) 
    }
    
    setColors(owners)
  }

  async function loadData() {
    let totalSupply = await contract.methods
      .totalSupply()
      .call();

    setSupply(totalSupply);

    contract.methods
      .maxMintable()
      .call()
      .then((maxMintable) => {
        setMaxMintable(maxMintable);
      })
      .catch((err) => console.log(err));

    contract.methods
      .balanceOf(address)
      .call()
      .then((_balance) => {
        setBalance(_balance);
      })
      .catch((err) => console.log(err));
  }

  function claim() {
    setIsClaiming(true);
    let _price = web3.utils.toWei("5");
    contract.methods
      .claim()
      .send({
        gasLimit: "285000",
        to: contractAddress,
        from: address,
        value: _price,
      })
      .once("error", (err) => {
        console.log(err);
        setIsClaiming(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setIsClaiming(false);
        loadData();

        const link = 'https://ftmscan.com/tx/' + receipt.transactionHash 

        Swal.fire({
          title: 'Success!',
          html: 'You can check the transaction at <a href="' + link + '" target="_blank" style="color: blue">Ftmscan</a>',
          icon: 'success',
          confirmButtonText: 'Cool'
        })
      });
  }

  const handleSeeColors = () => {
    setCanSeeColors(true)
    showColorsFromPerson()
  }

  const handleGoBack = () => {
    setCanSeeColors(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="header">
        <div className="tittle colorWhite">Crypto Colors</div>

        <button className='button' onClick={connectWallet}>
          {isReady ? address?.substring(0, 6) + "..." + address?.substring(address.length - 4, address.length) : "Connect" } {}
        </button>
      </div>

      <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        {!canSeeColors ? (
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '20px'
              }}>
                This is our first NFT collection and we called <div className='colorPink'>Crypto Colors</div>

                <div style={{ marginTop: '20px'}}>
                  <a href='https://twitter.com/CryptoColorsFTM' target='_blank' className='mr-10'>
                    <Image src='/assets/twitter.svg' alt='colors' width='20' height='20' />
                  </a>

                  <a href='https://discord.gg/4wtQBUuuhP' className='mr-10' target='_blank'>
                    <Image src='/assets/discord.svg' alt='colors' width='20' height='20' />
                  </a>

                  <a href='https://ftmscan.com/address/0x05E90E32ab55CbD75767C7863306471bCbF75d5e' className='mr-10' target='_blank'>
                    <Image src='/assets/fantom.svg' alt='colors' width='20' height='20' />
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', maxWidth: '400px', flexWrap: 'wrap' }}>
                <Image src='/assets/nfts/612.png' alt='color' width='100' height='100' />
                <Image src='/assets/nfts/620.png' alt='color' width='100' height='100' />
                <Image src='/assets/nfts/622.png' alt='color' width='100' height='100' />
                <Image src='/assets/nfts/623.png' alt='color' width='100' height='100' />
                <Image src='/assets/nfts/624.png' alt='color' width='100' height='100' />
                <Image src='/assets/nfts/625.png' alt='color' width='100' height='100' />
                <Image src='/assets/nfts/626.png' alt='color' width='100' height='100' />
                <Image src='/assets/nfts/629.png' alt='color' width='100' height='100' />
              </div>
            </div>
            
            {isReady && (
              <button className='button' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 20}} onClick={() => handleSeeColors()}>
                See my colors
              </button>
            )}
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
          }}>
            <p className='colorPink'>My colors</p>

            {colors.length > 0 && (
              colors.map(image => {
                const { id, title, description } = image.accountAddress
                return (
                  <div style={{ display: 'flex' }}>
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '20px'
                    }} 
                    key={id}
                    >
                      <p>{title}</p>
                      <Image src={`/assets/${id}.png`} alt='color' width='512' height='512' />
                      <p>{description}</p>
                    </div>
                  </div>
                )
              })
            )}
            
            <button className='button' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 20}} onClick={() => handleGoBack()}>
              Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
