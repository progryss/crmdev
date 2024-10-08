import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import CustomerDetails from "./CustomerDetails";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ThailandCustomer() {
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
  const [trigerUseeffectByDelete, setTrigerUseeffectByDelete] = useState(false);
  const tableHeaderRef = useRef(null);
  const StatusArr = ["Open", "Qualified", "Unqualified", "Opportunity", "Lost", "Won", "Spam"];
  const [filterOption, setFilterOption] = useState([]);
  const [demo, setDemo] = useState([]);

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
    function hit() {
      fetch(`${baseURL}/api/thailand/get-enquiries`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const keys = Object.keys(data[0]).filter(key => key !== '_id' && key !== '__v');
            const initialColumns = [
              { id: 'serialNumber', title: 'Sr No.' },
              { id: 'selectAll', title: 'Select All' },
              { id: 'date', title: 'Date' },
              { id: 'name', title: 'Name' },
              { id: 'email', title: 'Email' },
              { id: 'phone', title: 'Phone' },
              { id: 'month', title: 'Month' },
              { id: 'currentLocation', title: 'Current Location'},
              { id: 'noOfRooms', title: 'No of Rooms'},
              { id: 'status', title: 'Status' },
            ];
            const savedColumns = JSON.parse(localStorage.getItem('columnsThailand'));
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
          } else {
            const rowData = data.map((item, index) => ({ ...item, originalIndex: index }));
            const enrichedData = [...rowData].reverse();
            setData(enrichedData);
            setFilteredResults(enrichedData);
            setSelectAll(!selectAll);
          }
        });
      const savedWidths = JSON.parse(localStorage.getItem('columnWidthsThailand'));
      if (savedWidths) {
        setColumnWidths(savedWidths);
      }
    }
    if(filterOption.length === 0){
    hit()
    }
    console.log('useeffect 1')
  }, [viewingCustomer, trigerUseeffectByDelete]);

  useEffect(() => {
    let savedStatus = localStorage.getItem('statusThailand');
    if (savedStatus) {
      setFilterOption(JSON.parse(savedStatus))
    }
  }, [])

  useEffect(() => {
    async function getRes() {
      if (filterOption.length > 0) {
        const response = await axios.post(`${baseURL}/api/thailand/get-enquiries-by-status`, {
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            statusArray: filterOption
          }
        });
        let c = response.data
        let responseRev = c.reverse()
        setData(responseRev);
        setDemo(responseRev)
      } else {
        setTrigerUseeffectByDelete(!trigerUseeffectByDelete)
      }
    }
    getRes()
    localStorage.setItem('statusThailand', JSON.stringify(filterOption))
  }, [filterOption, demo])

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedColumns = Array.from(columns);
    const [reorderedColumn] = updatedColumns.splice(result.source.index, 1);
    if (result.source.index !== 0 && result.source.index !== 1) {
      updatedColumns.splice(result.destination.index, 0, reorderedColumn);
    }
    setColumns(updatedColumns);
    localStorage.setItem('columnsThailand', JSON.stringify(updatedColumns));
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
    localStorage.setItem('columnsThailand', JSON.stringify(updatedColumns));
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
  const currentRows = filterOption.length === 0 ? filteredResults.slice(indexOfFirstRow, indexOfLastRow) : demo.slice(indexOfFirstRow, indexOfLastRow);
  let tp;
  if (filterOption.length === 0) {
    tp = filteredResults.length / rowsPerPage;
  } else {
    tp = demo.length / rowsPerPage;
  }
  const totalPages = Math.ceil(tp);

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
    localStorage.setItem('columnWidthsThailand', JSON.stringify(updatedWidths));
  };

  if (viewingCustomer) {
    return <CustomerDetails customer={viewingCustomer} onBack={() => setViewingCustomer(null)} />;
  }

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
  };

  const deleteRowFromTable = async () => {
    // console.log(selectedRows);
    let userResponseText = selectedRows.length === 0 ? "No data Selected" : `Are you sure you want to delete ${selectedRows.length} Enquiries?`;
    const userResponse = window.confirm(userResponseText);
    if (userResponse) {
      try {
        const response = await axios.delete(`${baseURL}/api/thailand/delete-enquiries`, {
          headers: {
            'Content-Type': 'application/json'
          },
          data: { ids: selectedRows }
        });
        console.log(response.data);
        setTrigerUseeffectByDelete(!trigerUseeffectByDelete)
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setSelectedRows([])
  }

  const handleEnquiriesBYStatus = async (event) => {
    if (event.target.checked) {
      setFilterOption(filterOption => ([...filterOption, event.target.value]));
    } else {
      setFilterOption(filterOption => filterOption.filter((item) => item !== event.target.value))
    }
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
                  <div className="searchParentWrapper">
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
                    <button
                      className="btn btn-primary add-customer-btn" onClick={deleteRowFromTable}>
                      <i className="fa fa-trash"></i>
                    </button>
                    <button
                      className="btn btn-primary add-customer-btn"
                    >
                      <Link to='/thailand/add-enquiry' style={{ textDecoration: 'none' }}><i className="fas fa-plus me-1"></i> Add Customer</Link>
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
                      <div className="dropdown">
                        <button
                          className="btn btn-primary ml-3 dropdown-toggle text-nowrap"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-filter me-2"></i> Status
                        </button>
                        <ul className="dropdown-menu filterByStatus" aria-labelledby="dropdownMenuButton">
                          {StatusArr.map((item,index) => (
                            <li key={index}>
                              <label className="dropdown-item">
                                <input
                                  type="checkbox"
                                  value={item}
                                  onChange={e => handleEnquiriesBYStatus(e)}
                                  checked={filterOption.includes(item)}
                                /> {item}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="dropdown">
                        <button
                          className="btn btn-primary ml-3 dropdown-toggle text-nowrap"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-plus me-2"></i> Add Column
                        </button>
                        <ul className="dropdown-menu addCol" aria-labelledby="dropdownMenuButton">
                          {apiKeys.map((key,index) => (
                            <li key={index}>
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

          <div className="table-responsive customerTable">
            <DragDropContext onDragEnd={onDragEnd}>
              <table className="table text-start customer-table-css">
                <thead ref={tableHeaderRef}>
                  <Droppable droppableId="columns" direction="horizontal">
                    {(provided) => (
                      <tr ref={provided.innerRef} {...provided.droppableProps}>
                        {columns.map((column, index) => (
                          <Draggable
                            key={`${column.id}-${index}`}
                            draggableId={column.id}
                            index={index}
                            isDragDisabled={index === 0 || index === 1}
                          >
                            {(provided) => (
                              <th
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="text-center"
                              >
                                <ResizableBox
                                  width={columnWidths[column.id] || 100}
                                  height={23}
                                  axis="x"
                                  minConstraints={[10, 30]}
                                  maxConstraints={[2000, 23]}
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
                              <td key={column.id} >
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
                                  <span className={column.id}>{row[column.id]}</span>
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
