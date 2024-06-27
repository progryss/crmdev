import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import CustomerDetails from "./CustomerDetails";
import AddCustomer from "./AddCustomer";



export default function Customer() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const [columnWidths, setColumnWidths] = useState({});
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const tableHeaderRef = useRef(null);

  const searchItems = (searchValue) => {
    if (searchValue !== '') {
      const filteredData = data.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.phone.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.email.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(data);
    }
    setCurrentPage(1);
  };

  const baseURL = process.env.REACT_APP_BASE_URL || 'https://crm.progryss.com';

  useEffect(() => {
    fetch(`${baseURL}/api/get-enquiries`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const keys = Object.keys(data[0]).filter(key => key !== '_id' && key !== '__v');
          const initialColumns = [
            { id: 'serialNumber', title: 'Sr No.' },
            { id: 'selectAll', title: 'Select All' },
            ...keys.map(key => ({
              id: key,
              title: key.charAt(0).toUpperCase() + key.slice(1)
            }))
          ];
          const savedColumns = JSON.parse(localStorage.getItem('columns'));
          if (savedColumns) {
            setColumns(savedColumns);
          } else {
            setColumns(initialColumns);
          }
          const rowData = data.map((item, index) => ({ ...item, originalIndex: index }));
          const enrichedData = [...rowData].reverse();
          setApiKeys(keys);
          setData(enrichedData);
          setFilteredResults(enrichedData);
        }
      });
    const savedWidths = JSON.parse(localStorage.getItem('columnWidths'));
    if (savedWidths) {
      setColumnWidths(savedWidths);
    }
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedColumns = Array.from(columns);
    const [reorderedColumn] = updatedColumns.splice(result.source.index, 1);
    if (result.source.index !== 0 && result.source.index !== 1) {
      updatedColumns.splice(result.destination.index, 0, reorderedColumn);
    }
    setColumns(updatedColumns);
    localStorage.setItem('columns', JSON.stringify(updatedColumns));
  };

  const handleToggleColumn = (key) => {
    const columnExists = columns.find(column => column.id === key);
    let updatedColumns;
    if (columnExists) {
      updatedColumns = columns.filter(column => column.id !== key);
    } else {
      const newColumn = { id: key, title: key.charAt(0).toUpperCase() + key.slice(1) };
      updatedColumns = [...columns, newColumn];
    }
    setColumns(updatedColumns);
    localStorage.setItem('columns', JSON.stringify(updatedColumns));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedRows(newSelectAll ? data.map((row) => row._id) : []);
  };

  const handleSelectRow = (id) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.length === data.length);
    console.log(id)
  };

  const isDate = (value) => {
    return !isNaN(Date.parse(value));
  };

  const handleSort = (columnId) => {
    let direction = 'ascending';
    if (sortConfig.key === columnId && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key: columnId, direction });

    const sortedData = [...data].sort((a, b) => {
      let aValue = a[columnId];
      let bValue = b[columnId];

      // Check if the values are dates
      if (isDate(aValue) && isDate(bValue)) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
    setFilteredResults(sortedData); // Update filteredResults with sorted data
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredResults.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: tableHeaderRef.current.offsetTop, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: tableHeaderRef.current.offsetTop, behavior: 'smooth' });
    }
  };

  const handleResize = (columnId, width) => {
    const updatedWidths = {
      ...columnWidths,
      [columnId]: width
    };
    setColumnWidths(updatedWidths);
    localStorage.setItem('columnWidths', JSON.stringify(updatedWidths));
  };

  
  if (viewingCustomer) {
    return <CustomerDetails customer={viewingCustomer} onBack={() => setViewingCustomer(null)} />;
  }

  if (addingCustomer) {
    return <AddCustomer onBack={() => setAddingCustomer(false)} />;
  }

  return (

    <div className="container-fluid customer-container">
     
      <div className="card card-block border-0 customer-table-css-main">
        <div className="card-body p-0">
          <div className="p-3 bg-light add-cutomer-section">
            <div className="row mb-2">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span><i className="fas fa-user fa-sm"></i></span>
                    <span>
                      <h5 className="mb-0"><strong>Customer</strong></h5>
                    </span>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary me-2 add-customer-btn">
                      <i class="fa fa-trash"></i>
                    </button>
                    <button
                      className="btn btn-primary ml-3 add-customer-btn"
                      onClick={() => setAddingCustomer(true)}
                    >
                      <i className="fas fa-plus"></i> Add Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="no-of-item me-3">{data.length} Items</span>
                  </div>
                  <div>
                    <div className="d-flex gap-2">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control bg-custom border-end-0 search-input"
                          placeholder="Search Customer"
                          onChange={(e) => searchItems(e.target.value)}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn border border-start-0 search-icon-custom"
                            type="button"
                          >
                            <i className="fa fa-search"></i>
                          </button>
                        </div>
                      </div>
                      <div className="dropdown">
                        <button
                          className="btn btn-primary ml-3 dropdown-toggle text-nowrap"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-plus"></i> Add Column
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          {apiKeys.map((key) => (
                            <li key={key}>
                              <label className="dropdown-item">
                                <input
                                  type="checkbox"
                                  onChange={() => handleToggleColumn(key)}
                                  checked={columns.some(column => column.id === key)}
                                /> {key}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <DragDropContext onDragEnd={onDragEnd}>
              <table className="table text-start customer-table-css">
                <thead ref={tableHeaderRef}>
                  <Droppable droppableId="columns" direction="horizontal">
                    {(provided) => (
                      <tr ref={provided.innerRef} {...provided.droppableProps}>
                        {columns.map((column, index) => (
                          <Draggable
                            key={column.id}
                            draggableId={column.id}
                            index={index}
                            isDragDisabled={index === 0 || index === 1}
                          >
                            {(provided) => (
                              <th
                                key={column.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="text-center"
                              >
                                <ResizableBox
                                  width={columnWidths[column.id] || 100}
                                  height={23}
                                  axis="x"
                                  minConstraints={[50, 30]}
                                  maxConstraints={[200, 23]}
                                  resizeHandles={["e"]}
                                  className="resize-handle"
                                  onResizeStop={(e, data) => handleResize(column.id, data.size.width)}
                                >
                                  <div {...(index !== 0 && index !== 1 ? provided.dragHandleProps : {})}>
                                    {column.id === 'selectAll' ? (
                                      <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                      />
                                    ) : (
                                      <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <span className="truncate-text" title={column.title}>{column.title}</span>
                                        {column.id !== 'serialNumber' && (
                                          <div className="ml-2 sortable-header" onClick={() => handleSort(column.id)}>
                                            <i className={`fas ${sortConfig.key === column.id && sortConfig.direction === 'ascending' ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </ResizableBox>
                              </th>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tr>
                    )}
                  </Droppable>
                </thead>
                <tbody>
                  {currentRows.length > 0 ? (
                    currentRows.map((row, rowIndex) => (
                      <tr key={row.id} onClick={(e) => {
                        const target = e.target;
                        const isCheckbox = target.tagName.toLowerCase() === 'input' && target.type === 'checkbox';
                        if (!isCheckbox) {
                          setViewingCustomer(row);
                        }
                      }} style={{ cursor: "pointer" }}>
                        {columns.map((column) => {
                          if (column.id === 'serialNumber') {
                            return (
                              <td key={column.id}>{indexOfFirstRow + rowIndex + 1}</td>
                            );
                          } else if (column.id === 'selectAll') {
                            return (
                              <td key={column.id}>
                                <input
                                  type="checkbox"
                                  checked={selectedRows.includes(row._id)}
                                  onChange={() => handleSelectRow(row._id)}
                                />
                              </td>
                            );
                          } else {
                            return (
                              <td key={column.id}>
                                {row[column.id] && typeof row[column.id] === 'object' ? (
                                  <div>
                                    {column.id === 'address' && (
                                      <div>
                                        <div>Street: {row[column.id].street}</div>
                                        <div>Suite: {row[column.id].suite}</div>
                                        <div>City: {row[column.id].city}</div>
                                        <div>Zipcode: {row[column.id].zipcode}</div>
                                      </div>
                                    )}
                                    {column.id === 'company' && (
                                      <div>
                                        <div>Name: {row[column.id].name}</div>
                                        <div>Catch Phrase: {row[column.id].catchPhrase}</div>
                                        <div>Business: {row[column.id].bs}</div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  row[column.id]
                                )}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </DragDropContext>
          </div>
          {/* pagination */}
          {filteredResults.length > 0 && (
            <nav className="mt-3">
              <ul className="customer-pagination pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePrevPage}><i className="fa fa-chevron-left"></i></button>
                </li>
                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => { setCurrentPage(index + 1); window.scrollTo({ top: tableHeaderRef.current.offsetTop, behavior: 'smooth' }); }}>{index + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNextPage}><i className="fa fa-chevron-right"></i></button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
