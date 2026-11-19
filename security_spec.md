# StockSaathi Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. **Identity & Verification**: Only authenticated Google users with verified email (`request.auth != null && request.auth.token.email_verified == true`) can write or read user-scoped Firestore data.
2. **Strict Ownership**:
   - `/users/{userId}` and its subcollections (`/products/{productId}`, `/sales/{saleId}`) can only be read or written by `request.auth.uid == userId`.
   - Every document created under `/users/{userId}/products` or `/users/{userId}/sales` MUST have `ownerId == request.auth.uid` and `id == productId` / `saleId`.
   - `ownerId` and `createdAt` are immutable after creation.
3. **Positive & Bounded Numerics**:
   - Product `quantity >= 0`, `lowStockThreshold >= 0`, optional `price >= 0`.
   - Sale `quantity > 0`.
   - Product `history` list size `<= 50` and strings bounded (`<= 120` chars for names, `<= 500` chars for comments).
4. **PII Isolation & Founder Admin Access**:
   - `/users/{userId}` contains `email` and is strictly `isOwner(userId)`.
   - `/demoBookings/{bookingId}` and `/pilotFeedback/{feedbackId}` allow create by verified signed-in owners (`ownerId == request.auth.uid`) and read/list only by the document's `ownerId` or the verified founder admin (`Vaibhavbaghel61@gmail.com` with `email_verified == true`).
5. **Temporal Integrity**: `createdAt == request.time` on create and `updatedAt == request.time` on create/update.
6. **Path ID Hardening**: All document IDs (`userId`, `productId`, `saleId`, `bookingId`, `feedbackId`) must match `^[a-zA-Z0-9_\-]+$` and be `<= 128` characters.

## 2. "Dirty Dozen" Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated read/write** to `/users/uid1/products/p1`.
2. **Unverified email token** (`email_verified: false`) writing to `/users/uid1/products/p1` or spoofing admin email.
3. **Cross-tenant read/list** of `/users/victimUid/products` by `attackerUid`.
4. **Owner spoofing on create**: writing `/users/uid1/products/p1` with `ownerId: "victimUid"`.
5. **Ghost/Shadow field injection**: creating a Product with extra key `{ isAdmin: true }` or `{ shadow: "x" }`.
6. **Negative stock injection**: creating or updating a Product with `quantity: -5`.
7. **Invalid unit enum**: creating a Product with `unit: "tons"`.
8. **ID poisoning**: creating `/users/uid1/products/../../bad$id` or 200-char document ID.
9. **Immutable field tampering**: updating `createdAt` or `ownerId` on an existing Product.
10. **Client-forged timestamp**: creating a Product with `createdAt` not equal to `request.time`.
11. **Unbounded history array / Resource exhaustion**: Product `history` array with 100 items or 10KB `name`.
12. **Blanket query scraping**: listing `/demoBookings` or `/pilotFeedback` by non-owner / non-admin user.
