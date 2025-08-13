import React,{useState} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from 'reactstrap';

function HistoryModal({ isOpen, toggle, historyRecord, tableHead, firstRow, renderRow }) {
 
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        History
      </ModalHeader>
      <ModalBody>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {tableHead?.map((head, index) => (
                <th key={index}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            { !firstRow && historyRecord?.length === 0 ? (
              <tr>
                <td colSpan={tableHead?.length} className="text-center">No history available</td>
              </tr>
            ) : (
              <>
              {firstRow}
              {historyRecord?.map((record, index) => renderRow(record, index))}
              
              </>
            )}
          </tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default HistoryModal;
