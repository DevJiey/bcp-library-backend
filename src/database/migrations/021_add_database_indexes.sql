CREATE INDEX idx_users_role
ON users (role);

CREATE INDEX idx_users_account_status
ON users (account_status);

CREATE INDEX idx_users_borrower_type
ON users (borrower_type);


CREATE INDEX idx_books_title
ON books (title);

CREATE INDEX idx_books_category_id
ON books (category_id);

CREATE INDEX idx_books_publisher_id
ON books (publisher_id);

CREATE INDEX idx_books_is_active
ON books (is_active);


CREATE INDEX idx_book_copies_book_id
ON book_copies (book_id);

CREATE INDEX idx_book_copies_status
ON book_copies (status);

CREATE INDEX idx_book_copies_barcode
ON book_copies (barcode);


CREATE INDEX idx_borrow_requests_borrower_id
ON borrow_requests (borrower_id);

CREATE INDEX idx_borrow_requests_book_id
ON borrow_requests (book_id);

CREATE INDEX idx_borrow_requests_status
ON borrow_requests (status);


CREATE INDEX idx_borrow_transactions_borrower_id
ON borrow_transactions (borrower_id);

CREATE INDEX idx_borrow_transactions_book_copy_id
ON borrow_transactions (book_copy_id);

CREATE INDEX idx_borrow_transactions_status
ON borrow_transactions (status);

CREATE INDEX idx_borrow_transactions_due_at
ON borrow_transactions (due_at);


CREATE INDEX idx_return_records_borrow_transaction_id
ON return_records (borrow_transaction_id);


CREATE INDEX idx_announcements_status
ON announcements (status);

CREATE INDEX idx_announcements_audience
ON announcements (audience);