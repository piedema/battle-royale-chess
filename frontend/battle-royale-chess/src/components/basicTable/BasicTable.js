import { useTable } from 'react-table'

import styles from './BasicTable.module.css';

export default function BasicTable({ children, columns, data }){

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    })

    return (
        <table className={styles.table} {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                  <tr className={styles.tr} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th className={styles.th} {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row)
                  return (
                    <tr className={styles.tr} {...row.getRowProps()}>
                      {row.cells.map(cell => {
                        return <td className={styles.td} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      })}
                    </tr>
                  )
                })}
            </tbody>
        </table>
    )
}
