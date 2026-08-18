INSERT INTO library_settings (
    setting_key,
    setting_value,
    description
)
VALUES
    (
        'student_borrow_limit',
        '3',
        'Maximum number of active books a student borrower can have.'
    ),
    (
        'faculty_borrow_limit',
        '5',
        'Maximum number of active books a faculty borrower can have.'
    ),
    (
        'borrowing_period_days',
        '1',
        'Default borrowing period in days for all borrowers.'
    )
ON CONFLICT (setting_key) DO NOTHING;