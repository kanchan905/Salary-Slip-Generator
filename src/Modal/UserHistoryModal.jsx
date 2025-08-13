import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from 'reactstrap';

export default function UserHistoryModal({ open, onClose, history, current }) {
  const tableHead = ['Sr No', 'Name', 'Code', 'Status', 'Institute', 'Email', 'Added By', 'Edited By', 'Created At', 'Updated At'];


  return (
    <Modal isOpen={open} toggle={onClose} size="xl">
      <ModalHeader toggle={onClose}>History</ModalHeader>
      <ModalBody>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {tableHead.map((head, idx) => <th key={idx}>{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {/* First row: current data, green background */}
            {
              <tr className="bg-success text-white">
                <td>1</td>
                <td>{current?.name || '-'}</td>
                <td>{current?.employee_code || '-'}</td>
                <td>{current?.is_active === 1 ? 'Active' : 'Inactive'}</td>
                <td>{current?.institute || '-'}</td>
                <td>{current?.email || '-'}</td>
                <td>{current?.added_by
                  ? `${current.added_by.name || '-'}${current.added_by.roles && current.added_by.roles.length > 0 ? ' (' + current.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                  : 'NA'}</td>
                <td>{current?.edited_by
                  ? `${current.edited_by.name || '-'}${current.edited_by.roles && current.edited_by.roles.length > 0 ? ' (' + current.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                  : 'NA'}</td>
                <td>{current?.created_at ? new Date(current.created_at).toLocaleString() : '-'}</td>
                <td>{current?.updated_at ? new Date(current.updated_at).toLocaleString() : '-'}</td>
              </tr>
            }
            {/* History records */}
            {history && history.length > 0 ? (
              history.map((record, idx) => (
                <tr key={idx}>
                  <td>{idx + 2}</td>
                  <td>{record?.name || '-'}</td>
                  <td>{record?.employee_code || '-'}</td>
                  <td>{record?.is_active === 1 ? 'Active' : 'Inactive'}</td>
                  <td>{record?.institute || '-'}</td>
                  <td>{record?.email || '-'}</td>
                  <td>{record?.added_by
                    ? `${record.added_by.name || '-'}${record.added_by.roles && record.added_by.roles.length > 0 ? ' (' + record.added_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                    : 'NA'}</td>
                  <td>{record?.edited_by
                    ? `${record.edited_by.name || '-'}${record.edited_by.roles && record.edited_by.roles.length > 0 ? ' (' + record.edited_by.roles.map(role => role.name).join(', ') + ')' : ''}`
                    : 'NA'}</td>
                  <td>{record?.created_at ? new Date(record.created_at).toLocaleString() : '-'}</td>
                  <td>{record?.updated_at ? new Date(record.updated_at).toLocaleString() : '-'}</td>
                </tr>
              ))
            ) : null}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
} 