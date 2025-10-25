import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [activeProduct, setActiveProduct] = useState('zkthings');
  const [totalDownloads, setTotalDownloads] = useState('...');
  const [packageDownloads, setPackageDownloads] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [agentAnimation, setAgentAnimation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCode, setExpandedCode] = useState({});

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate agent text
  useEffect(() => {
    if (activeProduct === 'zksdkjs') {
      const interval = setInterval(() => {
        setAgentAnimation(prev => (prev + 1) % 6);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeProduct]);

  // Fetch download stats from NPM
  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const packages = [
          '@zkthings/proof-membership-evm',
          '@zkthings/range-proof-evm',
          '@zkthings/e2e-encryption-secp256k1',
          '@zkthings/e2e-encryption-ed25519',
          'zkmerkle'
        ];
        
        const downloadPromises = packages.map(pkg => 
          fetch(`https://api.npmjs.org/downloads/range/2020-01-01:${new Date().toISOString().split('T')[0]}/${pkg}`)
            .then(res => res.json())
            .then(data => ({ 
              package: pkg, 
              downloads: data.downloads?.reduce((sum, day) => sum + day.downloads, 0) || 0 
            }))
            .catch(() => ({ package: pkg, downloads: 0 }))
        );
        
        const results = await Promise.all(downloadPromises);
        const total = results.reduce((sum, result) => sum + (result.downloads || 0), 0);
        
        const packageStats = {};
        results.forEach(result => {
          packageStats[result.package] = result.downloads;
        });
        setPackageDownloads(packageStats);
        
        if (total > 0) {
          setTotalDownloads(total.toLocaleString());
        } else {
          setTotalDownloads('1,276');
        }
      } catch (error) {
        setTotalDownloads('1,276');
      }
    };

    fetchDownloads();
    const interval = setInterval(fetchDownloads, 30000);
    return () => clearInterval(interval);
  }, []);

  // Force black footer and inject stats
  useEffect(() => {
    const forceBlackFooter = () => {
      const footers = document.querySelectorAll('footer, .footer, [class*="footer"]');
      footers.forEach(footer => {
        footer.style.backgroundColor = '#000000';
        footer.style.background = '#000000';
        footer.style.backgroundImage = 'none';
      });
    };
    
    forceBlackFooter();
    const interval = setInterval(forceBlackFooter, 100);
    
    if (totalDownloads !== '...') {
      const footerCopyright = document.querySelector('.footer__copyright');
      if (footerCopyright) {
        footerCopyright.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <div style="font-family: var(--ifm-font-family-monospace); color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">
          
            </div>
            <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.8rem;">
              Copyright © ${new Date().getFullYear()} zkThings labs. • Powered by Goose
            </div>
          </div>
        `;
      }
    }
    
    return () => clearInterval(interval);
  }, [totalDownloads]);

  // All 5 libraries with full code examples
  const zkthingsLibraries = [
    {
      name: 'proof-membership-evm',
      description: 'Prove set membership without revealing identity',
      npm: '@zkthings/proof-membership-evm',
      installs: packageDownloads['@zkthings/proof-membership-evm'] || 336,
      code: `import { ZkMerkle, makeProof, verifyOffchain } from '@zkthings/proof-membership-evm';

// Initialize ZK Merkle Tree
const zkMerkle = new ZkMerkle()

// Add data and generate proof
const values = ['alice', 'bob', 'charlie']

const { proof, publicSignals } = await zkMerkle.generateMerkleProof(
  values,
  'alice'
)

// Verify off-chain 
const isValidOffChain = await zkMerkle.verifyProofOffChain(
  proof, 
  publicSignals
)

// Export and deploy verifier contract
const verifierContract = await zkMerkle.exportVerifierContract()`
    },
    {
      name: 'range-proof-evm',
      description: 'Prove values in ranges without exact amounts',
      npm: '@zkthings/range-proof-evm',
      installs: packageDownloads['@zkthings/range-proof-evm'] || 151,
      code: `import { RangeProof } from '@zkthings/range-proof-evm';

// Prove you're 18+ without revealing exact age
const rangeProof = new RangeProof();

const ageProof = await rangeProof.prove(
  25,   // Your actual age (SECRET!)
  18,   // Minimum age required (public)
  255   // Maximum possible age (public)
  // Auto-detects 8-bit circuit since max value is 255
);

// Verify the proof
const isValid = await rangeProof.verify(ageProof);
console.log('Valid adult:', isValid); // true

// Export Solidity Verifier
const verifierContract = await rangeProof.exportSolidityVerifier(ageProof);`
    },
    {
      name: 'e2e-encryption-secp256k1',
      description: 'End-to-end encryption for EVM wallets',
      npm: '@zkthings/e2e-encryption-secp256k1',
      installs: packageDownloads['@zkthings/e2e-encryption-secp256k1'] || 259,
      code: `const { Secp256k1E2E } = require('@zkthings/e2e-encryption-secp256k1');
const { Wallet } = require('ethers');

// Initialize E2E encryption
const e2e = new Secp256k1E2E();

// Create sample wallets
const alice = Wallet.createRandom();
const bob = Wallet.createRandom();

// Encrypt a message for Bob
const encrypted = await e2e.encryptFor(
  "Private message content",
  bob.address,
  Buffer.from(bob.publicKey.slice(2), 'hex')
);

// Bob decrypts the message
const decrypted = await e2e.decrypt({
  publicSignals: encrypted.publicSignals,
  privateKey: bob.privateKey
});

console.log(decrypted); // "Private message content"`
    },
    {
      name: 'e2e-encryption-ed25519',
      description: 'Private messaging for Solana & StarkNet wallets',
      npm: '@zkthings/e2e-encryption-ed25519',
      installs: packageDownloads['@zkthings/e2e-encryption-ed25519'] || 0,
      code: `import { Ed25519E2E } from '@zkthings/e2e-encryption-ed25519';

// Initialize E2E encryption for Ed25519 wallets
const e2e = new Ed25519E2E();

// Encrypt data for Solana wallet
const encrypted = await e2e.encryptFor(
  'Secret transaction details',
  'DQyrAcCrDXQ7NeoqGgDCZwBvkDDyF7piNC4bRoMvQSLE', // Solana address
  publicKey // Ed25519 public key
);

// Decrypt data with private key
const decrypted = await e2e.decrypt(encrypted, privateKey);
console.log(decrypted); // "Secret transaction details"

// Works with any Ed25519-compatible chain
// Solana, StarkNet, Cardano, etc.`
    },
    {
      name: 'zkmerkle (deprecated)',
      description: 'Simple zero-knowledge merkle tree proofs',
      npm: 'zkmerkle',
      installs: packageDownloads['zkmerkle'] || 530,
      code: `import { MerkleTree, generateProof, verifyProof } from 'zkmerkle';

// Create a merkle tree with private data
const privateData = [
  'user123',
  'user456', 
  'user789'
];

const tree = new MerkleTree(privateData);

// Generate proof for membership
const proof = generateProof(tree, 'user456');

// Verify without revealing the data
const isValid = verifyProof(
  proof,
  tree.getRoot(),
  'user456'
);

console.log('Membership verified:', isValid); // true

// Export for on-chain verification
const solidityProof = proof.toSolidity();`
    }
  ];

  const agentTasks = [
    "Developer agent extending @zksdkjs/railgun-provider proofs (recipe-developer.yaml)",
    "fhEVM specialist refreshing encrypted transfer mocks (recipe-zama-fhe-specialist.yaml)",
    "Strategy chief updating plans/zkSDK-development-plan.md with new milestones",
    "Tester agent wiring Jest suites inside sdk/packages/core via recipe-tester.yaml",
    "Social agent publishing outputs/social/dev_summary_*.md from the latest run",
    "launch-strategic-system.sh rotating providers based on memory/build_progress.json"
  ];

  return (
    <div style={{
      background: '#000',
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif"
    }}>
      {/* Ultra Minimal Header */}
      <div style={{
        padding: isMobile ? "40px 20px 30px" : "60px 20px 40px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: isMobile ? "32px" : "48px",
          fontWeight: "300",
          margin: "0 0 8px 0",
          letterSpacing: "-1px"
        }}>
          {siteConfig.title}
        </h1>
        <p style={{
          fontSize: isMobile ? "14px" : "16px",
          color: "rgba(255, 255, 255, 0.4)",
          margin: 0
        }}>
          Privacy dev tools
        </p>
      </div>

      {/* Product Toggle with Better UI */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: isMobile ? "40px" : "60px",
        gap: isMobile ? "16px" : "20px",
        padding: isMobile ? "0 20px" : "0"
      }}>
        <div style={{
          display: "inline-flex",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
          padding: "4px",
          position: "relative"
        }}>
          <button
            onClick={() => setActiveProduct('zkthings')}
            style={{
              padding: isMobile ? "8px 20px" : "10px 24px",
              background: activeProduct === 'zkthings' ? "#fff" : "transparent",
              color: activeProduct === 'zkthings' ? "#000" : "rgba(255, 255, 255, 0.6)",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none"
            }}
          >
            zkthings
          </button>
          <button
            onClick={() => setActiveProduct('zksdkjs')}
            style={{
              padding: isMobile ? "8px 20px" : "10px 24px",
              background: activeProduct === 'zksdkjs' ? "#fff" : "transparent",
              color: activeProduct === 'zksdkjs' ? "#000" : "rgba(255, 255, 255, 0.6)",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
              position: "relative"
            }}
          >
            zkSDKjs
            {activeProduct !== 'zksdkjs' && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "#4ade80",
                color: "#000",
                                    fontSize: isMobile ? "9px" : "10px",
                    padding: isMobile ? "1px 4px" : "2px 6px",
                borderRadius: "10px",
                fontWeight: "600"
              }}>
                NEW
              </span>
            )}
          </button>
        </div>
        
        {/* Add description under toggle for zkSDKjs */}
        {/* {activeProduct !== 'zksdkjs' && (
          <p style={{
            fontSize: "13px",
            color: "rgba(255, 255, 255, 0.4)",
            margin: 0,
            textAlign: "center"
          }}>
            zkThings - Privacy primitives for EVM, Solona , Bitcoin
            and more.
          </p>
        )} */}
      </div>

      {/* Content Area */}
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: isMobile ? "0 20px 60px" : "0 20px 80px"
      }}>
        {/* zkthings Content */}
        {activeProduct === 'zkthings' && (
          <div style={{
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{
              textAlign: "center",
              marginBottom: "60px"
            }}>
              <h2 style={{
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: "300",
                margin: "0 0 16px 0"
              }}>
    zkThings - Privacy primitives for EVM, Solona , Bitcoin
    and more.
              </h2>
              <p style={{
                fontSize: "16px",
                color: "rgba(255, 255, 255, 0.5)",
                margin: "0 0 8px 0"
              }}>
                Available now • {totalDownloads} downloads
              </p>
              <p style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.4)"
              }}>
              </p>
            </div>

            {/* Responsive Layout - Stack on mobile */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "24px" : "40px",
              alignItems: "stretch"
            }}>
              {/* Libraries List - Scrollable */}
              <div style={{
                flex: isMobile ? "1" : "0 0 400px",
                minWidth: 0
              }}>
                <div style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: "rgba(255, 255, 255, 0.4)",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  Libraries • {isMobile ? "Tap" : "Click"} to view example
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  maxHeight: isMobile ? "300px" : "500px",
                  overflowY: "auto",
                  paddingRight: "8px"
                }}>
                  {zkthingsLibraries.map((lib, index) => (
                    <div
                      key={lib.name}
                      onClick={() => setSelectedPackage(index)}
                      style={{
                        padding: "16px",
                        background: selectedPackage === index 
                          ? "rgba(255, 255, 255, 0.08)" 
                          : "rgba(255, 255, 255, 0.03)",
                        border: "1px solid",
                        borderColor: selectedPackage === index 
                          ? "rgba(255, 255, 255, 0.3)" 
                          : "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (selectedPackage !== index) {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedPackage !== index) {
                          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                        }
                      }}
                    >
                      <h3 style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        margin: "0 0 4px 0",
                        color: selectedPackage === index ? "#fff" : "rgba(255, 255, 255, 0.9)"
                      }}>
                        {lib.name}
                      </h3>
                      <p style={{
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.5)",
                        margin: "0 0 8px 0"
                      }}>
                        {lib.description}
                      </p>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <code style={{
                          fontSize: "10px",
                          color: "rgba(255, 255, 255, 0.3)",
                          fontFamily: "SF Mono, monospace"
                        }}>
                          {lib.npm}
                        </code>
                        <span style={{
                          fontSize: "11px",
                          color: "rgba(255, 255, 255, 0.4)"
                        }}>
                          {lib.installs.toLocaleString()} installs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Example - Shows selected library */}
              <div style={{
                flex: "1",
                minWidth: 0
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px"
                }}>
                  <div style={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                  }}>
                    {zkthingsLibraries[selectedPackage].name} Example
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(zkthingsLibraries[selectedPackage].code)}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "4px",
                      padding: "4px 12px",
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontFamily: "SF Mono, monospace",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                      e.target.style.color = "rgba(255, 255, 255, 0.8)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                      e.target.style.color = "rgba(255, 255, 255, 0.6)";
                    }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{
                  position: "relative",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: 0,
                  overflow: "hidden",
                  maxWidth: "100%"
                }}>
                  {isMobile && (
                    <button
                      onClick={() => setExpandedCode({
                        ...expandedCode,
                        [`zkthings-${selectedPackage}`]: !expandedCode[`zkthings-${selectedPackage}`]
                      })}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(74, 222, 128, 0.1)",
                        color: "#4ade80",
                        fontSize: "11px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        border: "1px solid rgba(74, 222, 128, 0.3)",
                        zIndex: 10,
                        fontFamily: "SF Mono, monospace",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(74, 222, 128, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(74, 222, 128, 0.1)";
                      }}
                    >
                      {expandedCode[`zkthings-${selectedPackage}`] ? "Collapse" : "View Full Code"}
                    </button>
                  )}
                  <div style={{
                    overflowX: "auto",
                    overflowY: isMobile && !expandedCode[`zkthings-${selectedPackage}`] ? "hidden" : "auto",
                    padding: isMobile ? "12px" : "24px",
                    maxHeight: isMobile && !expandedCode[`zkthings-${selectedPackage}`] ? "150px" : "450px",
                    transition: "max-height 0.3s ease",
                    WebkitOverflowScrolling: "touch"
                  }}>
                    <pre style={{ 
                      margin: 0,
                      overflow: "visible"
                    }}>
                      <code style={{
                        fontSize: isMobile ? "11px" : "12px",
                        lineHeight: "1.6",
                        color: "rgba(255, 255, 255, 0.9)",
                        fontFamily: "SF Mono, monospace",
                        whiteSpace: "pre",
                        wordBreak: "normal",
                        display: "block"
                      }}>
                        {zkthingsLibraries[selectedPackage].code}
                      </code>
                    </pre>
                    {isMobile && !expandedCode[`zkthings-${selectedPackage}`] && (
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60px",
                        background: "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))",
                        pointerEvents: "none"
                      }} />
                    )}
                  </div>
                </div>
                
                {/* Install command */}
                <div style={{
                  marginTop: "16px",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "6px",
                  overflow: "auto"
                }}>
                  <code style={{
                    fontSize: isMobile ? "11px" : "12px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "SF Mono, monospace",
                    whiteSpace: "nowrap"
                  }}>
                    npm install {zkthingsLibraries[selectedPackage].npm}
                  </code>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{
              textAlign: "center",
              marginTop: "60px"
            }}>
              <Link
                to="/docs/intro"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "#fff",
                  color: "#000",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "transform 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Get Started →
              </Link>
            </div>
          </div>
        )}

        {/* zkSDKjs Content */}
        {activeProduct === 'zksdkjs' && (
          <div style={{
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{
              textAlign: "center",
              marginBottom: "60px"
            }}>
              <h2 style={{
                fontSize: isMobile ? "28px" : "36px",
                fontWeight: "300",
                margin: "0 0 16px 0"
              }}>
                One SDK for Privacy Everywhere
              </h2>
              <p style={{
                fontSize: isMobile ? "16px" : "18px",
                color: "rgba(255, 255, 255, 0.7)",
                margin: "0 0 12px 0",
                lineHeight: "1.5"
              }}>
                Goose agents in github.com/zksdkjs/agent are shipping the real @zksdkjs/core runtime, provider packages, and docs in public.
              </p>
              <p style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.4)"
              }}>
                Coming Q4 2025 • Powered by Goose
              </p>
            </div>

            {/* Live Status */}
            <div style={{
              background: "rgba(74, 222, 128, 0.05)",
              border: "1px solid rgba(74, 222, 128, 0.2)",
              borderRadius: "8px",
              padding: isMobile ? "16px" : "24px",
              marginBottom: isMobile ? "30px" : "40px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#4ade80",
                  animation: "pulse 2s infinite"
                }} />
                <span style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "500"
                }}>
                  AI Agents Building Live 24/7
                </span>
              </div>
              <p style={{
                fontSize: isMobile ? "12px" : "13px",
                color: "rgba(255, 255, 255, 0.6)",
                margin: 0,
                fontFamily: "SF Mono, monospace",
                wordBreak: "break-word"
              }}>
                {agentTasks[agentAnimation]}
              </p>
            </div>

            {/* The Problem & Solution */}
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "24px" : "32px",
              marginBottom: "40px"
            }}>
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: "0 0 12px 0",
                  color: "rgba(255, 100, 100, 0.9)"
                }}>
                  The Problem
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: "1.6"
                }}>
                  Every blockchain has different privacy protocols. Developers need to learn Railgun for Ethereum, 
                  CoinJoin for Bitcoin, Privacy Cash for Solana. Weeks of integration for each chain.
                </p>
              </div>
              <div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  margin: "0 0 12px 0",
                  color: "rgba(100, 255, 100, 0.9)"
                }}>
                  The Solution
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: "1.6"
                }}>
                  A single TypeScript runtime (`@zksdkjs/core`) routes calls to provider packages like Railgun, Aztec, and Zama&apos;s fhEVM.
                  Goose keeps recipes, scripts, and docs current so the same `sdk.transfer` call works across every chain.
                </p>
              </div>
            </div>

            {/* Code Example */}
            <div style={{
              marginBottom: "40px"
            }}>
              <div style={{
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.4)",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Universal Privacy API
              </div>
              <div style={{
                position: "relative",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: 0,
                overflow: "hidden",
                maxWidth: "100%"
              }}>
                {isMobile && (
                  <button
                    onClick={() => setExpandedCode({
                      ...expandedCode,
                      'zksdkjs': !expandedCode['zksdkjs']
                    })}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "rgba(74, 222, 128, 0.1)",
                      color: "#4ade80",
                      fontSize: "11px",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      border: "1px solid rgba(74, 222, 128, 0.3)",
                      zIndex: 10,
                      fontFamily: "SF Mono, monospace",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "rgba(74, 222, 128, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(74, 222, 128, 0.1)";
                    }}
                  >
                    {expandedCode['zksdkjs'] ? "Collapse" : "View Full Code"}
                  </button>
                )}
                <div style={{
                  overflowX: "auto",
                  overflowY: isMobile && !expandedCode['zksdkjs'] ? "hidden" : "auto",
                  padding: isMobile ? "12px" : "24px",
                  maxHeight: isMobile && !expandedCode['zksdkjs'] ? "200px" : "none",
                  transition: "max-height 0.3s ease",
                  WebkitOverflowScrolling: "touch"
                }}>
                  <pre style={{ 
                    margin: 0,
                    overflow: "visible"
                  }}>
                    <code style={{
                      fontSize: isMobile ? "11px" : "13px",
                      lineHeight: "1.6",
                      color: "rgba(255, 255, 255, 0.9)",
                      fontFamily: "SF Mono, monospace",
                      whiteSpace: "pre",
                      wordBreak: "normal",
                      display: "block"
                    }}>
{`import { ZkSDK } from '@zksdkjs/core';
import { RailgunProvider } from '@zksdkjs/railgun-provider';
import { FHEVMProvider } from '@zksdkjs/provider-fhevm';

const sdk = new ZkSDK({
  providers: {
    railgun: new RailgunProvider({
      rpcEndpoints: { ethereum: 'https://mainnet.infura.io/v3/<key>' },
      engineDbPath: './railgun-db',
      walletMnemonic: process.env.RAILGUN_MNEMONIC
    })
  },
  defaultProvider: 'railgun'
});

// Providers can be registered later as the Goose agents ship new packages
sdk.addProvider(
  'fhevm',
  new FHEVMProvider({
    rpcUrl: 'https://fhevm.devnet.zama.ai',
    gatewayUrl: 'https://gateway.zama.ai'
  })
);

await sdk.transfer(
  {
    chain: 'ethereum',
    token: 'USDC',
    amount: '1000000',
    to: '0xRecipient',
    privacy: 'shielded'
  },
  'railgun'
);

// Switch providers with the same API surface
await sdk.transfer(
  {
    chain: 'ethereum',
    token: 'USDC',
    amount: '500000',
    to: '0xConfidential',
    privacy: 'anonymous'
  },
  'fhevm'
);`}
                    </code>
                  </pre>
                  {isMobile && !expandedCode['zksdkjs'] && (
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "60px",
                      background: "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.9))",
                      pointerEvents: "none"
                    }} />
                  )}
                </div>
              </div>
            </div>

            {/* AI Agents */}
            <div style={{
              marginBottom: "40px"
            }}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "400",
                margin: "0 0 16px 0"
              }}>
                Autonomous Development with Goose
              </h3>
              <p style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: "1.6",
                marginBottom: "20px"
              }}>
                Specialized AI agents work 24/7 using Goose to research, develop, test, and maintain the SDK.
                They analyze new privacy protocols daily, write integration code, create documentation, and ensure
                compatibility across all chains. No human bottlenecks, just continuous improvement.
              </p>
              
              {/* Agent Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: isMobile ? "12px" : "16px"
              }}>
                {[
                  { name: "Chief Strategy Officer", task: "Runs recipe-strategy-chief.yaml to update roadmaps & risks" },
                  { name: "Developer Agent", task: "Extends sdk/packages/providers via recipe-developer.yaml" },
                  { name: "Research & Intelligence", task: "Scans new privacy tech, logs findings in outputs/strategic/" },
                  { name: "Marketing & Growth", task: "Builds go-to-market plans and community updates" },
                  { name: "Specialist Recipes", task: "Railgun, Aztec, fhEVM deep dives triggered by orchestration" },
                  { name: "Release & Operations", task: "Preps launch checklists, SLAs, and health checks" }
                ].map((agent, i) => (
                  <div key={i} style={{
                    padding: "12px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "6px"
                  }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "rgba(255, 255, 255, 0.8)",
                      marginBottom: "4px"
                    }}>
                      {agent.name}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.5)"
                    }}>
                      {agent.task}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "16px",
              justifyContent: "center",
              alignItems: isMobile ? "stretch" : "center"
            }}>
              <Link
                to="/docs/zksdkjs/overview"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "#4ade80",
                  color: "#000",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.background = "#5be88a";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.background = "#4ade80";
                }}
              >
                Read the Overview →
              </Link>
              <a
                href="https://github.com/zksdkjs/agent"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  textDecoration: "none",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.4)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Watch Progress on GitHub
              </a>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }
        
        /* Custom scrollbar for libraries list */
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Layout
      description="Goose agents building the universal privacy SDK for every blockchain">
      <HomepageHeader />
    </Layout>
  );
}
