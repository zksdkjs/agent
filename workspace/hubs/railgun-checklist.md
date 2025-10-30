# Railgun Provider - TODO Checklist

## 🚨 Critical (Blocking Everything)
- [ ] Install `level` dependency (npm install level @types/level)
- [ ] Fix database path format (remove "./" prefix at line 92-94)

## 💻 Core Implementation
- [ ] Remove test mode fallbacks (lines 262-273, 509-520, 620-630)
- [ ] Implement balance extraction (line 429 TODO)
- [ ] Fix transaction broadcasting - use signer.sendTransaction() (lines 337, 559, 691)
- [ ] Add signer to RailgunConfig interface
- [ ] Create typed error classes (RailgunError, etc.)
- [ ] Fix provider type casting (lines 758, 778)

## 🧪 Testing
- [ ] Update mocks for populateProvedTransfer and populateShield
- [ ] Fix test expectations (no test mode checks)
- [ ] Get 90% coverage

## 📚 Documentation
- [ ] Create 5 example files in examples/ folder
- [ ] Update package README.md
- [ ] Update docs site (integration-flows.md, provider-comparison.md, overview.md)

## 🧹 Cleanup
- [ ] Delete test-railgun-*.ts debug files
- [ ] Update dev-hand-off.md with completion notes
- [ ] Run final verification (build, test, git status)

---

**Total**: 15 tasks | ~5-7 hours
