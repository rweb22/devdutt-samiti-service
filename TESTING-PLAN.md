# Testing Plan - devdutt-samiti-service

**Date:** March 6, 2026  
**Status:** Phase 6 - Integration & Testing

---

## 📋 Testing Checklist

### ✅ Phase 1: Database Setup
- [ ] Run migrations successfully
- [ ] Verify ltree extension enabled
- [ ] Verify all 7 tables created
- [ ] Verify all indexes created
- [ ] Verify all constraints working
- [ ] Test ltree path auto-computation trigger

### ✅ Phase 2: Core Samiti Service
- [ ] Create root samiti
- [ ] Create child samiti
- [ ] Test ltree path generation
- [ ] Test name uniqueness validation
- [ ] Test depth limit (max 10 levels)
- [ ] Browse hierarchy (get children, descendants, ancestors)
- [ ] Update samiti name/title

### ✅ Phase 3: Membership Service
- [ ] Appoint member (OBSERVER, SADASYA, SABHAPATI)
- [ ] Test duplicate membership prevention
- [ ] Promote observer to sadasya
- [ ] Remove member
- [ ] Verify audit trail (membership_changes)
- [ ] Create role offer
- [ ] Accept role offer (creates membership)
- [ ] Reject role offer
- [ ] Test duplicate offer prevention

### ✅ Phase 4: NCM Workflow
- [ ] Initiate NCM (member only)
- [ ] Test duplicate active motion prevention
- [ ] Sign motion (member only)
- [ ] Test duplicate signature prevention
- [ ] Auto-transition to VOTING when threshold met
- [ ] Vote on motion (FOR, AGAINST, ABSTAIN)
- [ ] Test duplicate vote prevention
- [ ] Finalize voting (PASSED removes sabhapati)
- [ ] Finalize voting (FAILED keeps sabhapati)
- [ ] Verify sabhapati removal and VACANT status

---

## 🧪 Test Scenarios

### Scenario 1: Complete Samiti Lifecycle
1. Admin creates root samiti "national_samiti"
2. Admin appoints sabhapati via role offer
3. User accepts role offer
4. Sabhapati creates child samiti "economy"
5. Sabhapati appoints members
6. Verify hierarchy: national_samiti.economy

### Scenario 2: NCM Success Flow
1. Member initiates NCM against sabhapati
2. 3 members sign the motion
3. Motion auto-transitions to VOTING
4. Members vote (majority FOR)
5. Finalize voting
6. Verify sabhapati removed
7. Verify samiti status = VACANT

### Scenario 3: NCM Failure Flow
1. Member initiates NCM
2. 3 members sign
3. Members vote (majority AGAINST)
4. Finalize voting
5. Verify sabhapati remains
6. Verify motion status = FAILED

### Scenario 4: Role Offer Workflow
1. Sabhapati creates role offer for user
2. User views pending offers
3. User accepts offer
4. Verify membership created
5. Verify offer status = ACCEPTED

---

## 🔧 Manual Testing Commands

### Setup Database
```bash
cd ~/workspace/Devdutt/devdutt-samiti-service
./run-migrations.sh
```

### Start Service
```bash
npm run start:dev
```

### Test Health Endpoint
```bash
curl http://localhost:3002/health
```

### Create Root Samiti
```bash
curl -X POST http://localhost:3002/api/v1/admin/samitis \
  -H "Content-Type: application/json" \
  -d '{
    "name": "national_samiti",
    "title": "National Samiti"
  }'
```

### Get Root Samitis
```bash
curl http://localhost:3002/api/v1/samitis
```

---

## 📊 Success Criteria

- [ ] All migrations run successfully
- [ ] Service starts without errors
- [ ] All 27 API endpoints respond
- [ ] ltree path auto-computation works
- [ ] All business logic validations work
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] Database constraints enforced
- [ ] Audit trails created correctly
- [ ] State machine transitions work

---

## 🐛 Known Issues / TODOs

- [ ] Authentication guards not implemented (using placeholders)
- [ ] JWT validation not implemented
- [ ] Service-to-service communication not implemented
- [ ] Content sanitization not implemented
- [ ] Rate limiting not configured
- [ ] Logging not configured
- [ ] Error responses not standardized

---

## 📝 Next Steps After Testing

1. Document all API endpoints
2. Create Swagger/OpenAPI documentation
3. Add authentication guards
4. Implement JWT validation
5. Add integration tests
6. Add E2E tests
7. Performance testing
8. Security review

