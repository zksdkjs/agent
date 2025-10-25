#!/bin/bash

echo "🚀 zkSDK Specialist Agent Launcher"
echo "=================================="
echo ""
echo "Choose which specialist agent to launch:"
echo ""
echo "1) Zama FHE Specialist (Implement fhEVM provider)"
echo "2) Privacy Cash Specialist (Solana ZK compression)"
echo "3) Bitcoin Privacy Specialist (Silent Payments)"
echo "4) Railgun Specialist (Complete EVM privacy)"
echo "5) Aztec Specialist (L2 privacy)"
echo "6) ALL Specialists in sequence"
echo "7) Main Developer Agent (Coordinates all)"
echo "8) Social Media Agent (Create content)"
echo ""
read -p "Enter choice [1-8]: " choice

case $choice in
    1)
        echo "🔐 Launching Zama FHE Specialist..."
        goose run --recipe recipes/recipe-zama-fhe-specialist.yaml \
            --name "zama_fhe_$(date +%m%d_%H%M)" \
            --max-turns 20
        ;;
    2)
        echo "⚡ Launching Privacy Cash Specialist..."
        goose run --recipe recipes/recipe-light-protocol-specialist.yaml \
            --name "light_protocol_$(date +%m%d_%H%M)" \
            --max-turns 20
        ;;
    3)
        echo "₿ Launching Bitcoin Privacy Specialist..."
        goose run --recipe recipes/recipe-bitcoin-privacy-specialist.yaml \
            --name "bitcoin_privacy_$(date +%m%d_%H%M)" \
            --max-turns 15
        ;;
    4)
        echo "🚂 Launching Railgun Specialist..."
        goose run --recipe recipes/recipe-railgun-specialist.yaml \
            --name "railgun_$(date +%m%d_%H%M)" \
            --max-turns 15
        ;;
    5)
        echo "🏛️ Launching Aztec Specialist..."
        goose run --recipe recipes/recipe-aztec-specialist.yaml \
            --name "aztec_$(date +%m%d_%H%M)" \
            --max-turns 15
        ;;
    6)
        echo "🎯 Launching ALL Specialists in sequence..."
        
        echo "Step 1/5: Zama FHE..."
        goose run --recipe recipes/recipe-zama-fhe-specialist.yaml \
            --name "zama_$(date +%m%d)" --max-turns 10
        
        echo "Step 2/5: Privacy Cash..."
        goose run --recipe recipes/recipe-light-protocol-specialist.yaml \
            --name "light_$(date +%m%d)" --max-turns 10
        
        echo "Step 3/5: Bitcoin Privacy..."
        goose run --recipe recipes/recipe-bitcoin-privacy-specialist.yaml \
            --name "bitcoin_$(date +%m%d)" --max-turns 8
        
        echo "Step 4/5: Railgun..."
        goose run --recipe recipes/recipe-railgun-specialist.yaml \
            --name "railgun_$(date +%m%d)" --max-turns 8
        
        echo "Step 5/5: Social Content..."
        goose run --recipe recipes/recipe-social.yaml \
            --name "social_$(date +%m%d)" --max-turns 5
        ;;
    7)
        echo "👨‍💻 Launching Main Developer Agent..."
        goose run --recipe recipes/recipe-developer.yaml \
            --name "dev_main_$(date +%m%d_%H%M)" \
            --max-turns 25
        ;;
    8)
        echo "📱 Launching Social Media Agent..."
        goose run --recipe recipes/recipe-social.yaml \
            --name "social_$(date +%m%d_%H%M)" \
            --max-turns 5
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "✅ Agent launched! Check outputs/ for results"