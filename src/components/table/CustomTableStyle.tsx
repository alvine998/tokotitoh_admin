export const CustomTableStyle = {
    headCells: {
        style: {
            fontSize: '13px',
            fontWeight: '600',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            paddingLeft: '16px',
            paddingRight: '16px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.025em',
        },
    },
    cells: {
        style: {
            paddingLeft: '16px',
            paddingRight: '16px',
            fontSize: '14px',
            color: '#374151',
        }
    },
    rows: {
        style: {
            borderBottom: '1px solid #f3f4f6',
            '&:hover': {
                backgroundColor: '#f9fafb',
            },
        },
    },
    pagination: {
        style: {
            borderTop: '1px solid #e5e7eb',
            fontSize: '14px',
            color: '#6b7280',
        },
    },
}
