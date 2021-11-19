import { useTable, useSortBy } from 'react-table'

import styles from './BasicTable.module.css';

export default function BasicTable(params){

    const defaultPropGetter = () => ({})

    const {
        columns = [],
        data = [],
        getHeaderProps = defaultPropGetter,
        getColumnProps = defaultPropGetter,
        getRowProps = defaultPropGetter,
        getCellProps = defaultPropGetter
    } = params

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    )

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                {
                    data.length > 0
                    ? (
                        <table
                            className={styles.table}
                            {...getTableProps()}>
                            <thead
                                className={styles.thead}>
                                {headerGroups.map((headerGroup, i) => (
                                  <tr
                                    className={styles.tr}
                                    {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                      <th
                                        className={styles.th}
                                        {...column.getHeaderProps([
                                            column.getSortByToggleProps(),
                                            getColumnProps(column),
                                            getHeaderProps(column)
                                        ])}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted
                                              ? column.isSortedDesc
                                                ? ' ▼'
                                                : ' ▲'
                                              : '\u00A0\u00A0\u00A0\u00A0'}
                                          </span>
                                      </th>
                                    ))}
                                  </tr>
                                ))}
                                </thead>
                                <tbody
                                    className={styles.tbody}
                                    {...getTableBodyProps()}>
                                    {rows.map((row, i) => {
                                      prepareRow(row)
                                      return (
                                        <tr
                                            className={styles.tr}
                                            {...row.getRowProps(getRowProps(row))}>
                                              {row.cells.map(cell => {
                                                return (
                                                    <td
                                                        className={styles.td}
                                                        {...cell.getCellProps([
                                                            getColumnProps(cell.column),
                                                            getCellProps(cell)
                                                        ])}>
                                                        {cell.render('Cell')}
                                                    </td>
                                                )
                                              })}
                                        </tr>
                                      )
                                    })}
                            </tbody>
                        </table>
                    )
                    : 'No records found'
                }
            </div>
        </div>
    )
}
