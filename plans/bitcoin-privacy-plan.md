# Bitcoin Silent Payments Implementation Plan

## Current Status
- Basic structure implemented with SilentPaymentAddressGenerator and SilentPaymentScanner classes
- Core cryptographic functions in place
- Bech32 encoding/decoding implemented
- Test vectors included

## Required Improvements for BIP352 Compliance

### 1. Address Encoding/Decoding
- [ ] Fix bech32m encoding (currently using bech32)
- [ ] Ensure proper human-readable prefixes (sp, tsp, sssp, sprt)
- [ ] Verify payload length restrictions

### 2. Input Processing
- [ ] Implement proper input selection according to BIP352 (P2TR, P2WPKH, P2SH-P2WPKH, P2PKH)
- [ ] Handle taproot keypath vs scriptpath spends correctly
- [ ] Skip inputs with SegWit version > 1
- [ ] Handle NUMS point H for taproot script path spends

### 3. Shared Secret Calculation
- [ ] Fix ECDH shared secret calculation to match BIP352 specification
- [ ] Ensure proper input aggregation using all eligible inputs
- [ ] Implement correct input hash calculation using outpoint serialization

### 4. Output Generation
- [ ] Fix tweak calculation to match BIP352/SharedSecret tag
- [ ] Ensure proper handling of scalar validation (0 < tweak < n)
- [ ] Implement proper Taproot output creation
- [ ] Support for multiple outputs with index incrementing

### 5. Scanning Implementation
- [ ] Fix scanning logic to match sender's output generation
- [ ] Implement proper transaction eligibility checks
- [ ] Add support for labeled addresses
- [ ] Implement change output detection

### 6. Key Derivation
- [ ] Implement BIP32 derivation paths for scan/spend keys
- [ ] Add support for hardened derivation

### 7. Error Handling
- [ ] Add proper validation for edge cases
- [ ] Implement failure conditions as specified in BIP352

## Implementation Timeline

### Phase 1: Core Compliance (1-2 days)
- Fix address encoding/decoding
- Correct shared secret calculation
- Fix tweak calculation
- Implement proper input processing

### Phase 2: Advanced Features (2-3 days)
- Add labeled address support
- Implement change output detection
- Add BIP32 key derivation

### Phase 3: Testing & Validation (1-2 days)
- Validate with BIP352 test vectors
- Integration testing
- Edge case handling

## Test Vector Validation
- [ ] Validate with provided BIP352 test vectors
- [ ] Add additional edge case tests
- [ ] Performance testing

## Documentation
- [ ] Update README with implementation details
- [ ] Add API documentation
- [ ] Include usage examples for all features
