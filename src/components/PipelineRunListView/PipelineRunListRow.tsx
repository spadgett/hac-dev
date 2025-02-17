import React from 'react';
import { Link } from 'react-router-dom';
import { PipelineRunLabel } from '../../consts/pipelinerun';
import { ScanResults } from '../../hooks/useScanResults';
import ActionMenu from '../../shared/components/action-menu/ActionMenu';
import { RowFunctionArgs, TableData } from '../../shared/components/table';
import { Timestamp } from '../../shared/components/timestamp/Timestamp';
import { PipelineRunKind } from '../../types';
import { calculateDuration, pipelineRunStatus } from '../../utils/pipeline-utils';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { StatusIconWithText } from '../topology/StatusIcon';
import { usePipelinerunActions } from './pipelinerun-actions';
import { pipelineRunTableColumnClasses } from './PipelineRunListHeader';
import { ScanStatus } from './ScanStatus';

type PipelineListRowProps = RowFunctionArgs<PipelineRunKind & { scanResults: ScanResults }>;

const PipelineListRow: React.FC<PipelineListRowProps> = ({ obj }) => {
  const capitalize = (label: string) => {
    return label && label.charAt(0).toUpperCase() + label.slice(1);
  };

  const status = pipelineRunStatus(obj);
  const actions = usePipelinerunActions(obj);
  const { workspace } = useWorkspaceInfo();
  const applicationName = obj.metadata?.labels[PipelineRunLabel.APPLICATION];

  return (
    <>
      <TableData className={pipelineRunTableColumnClasses.name}>
        <Link
          to={`/application-pipeline/workspaces/${workspace}/applications/${applicationName}/pipelineruns/${obj.metadata?.name}`}
          title={obj.metadata?.name}
        >
          {obj.metadata?.name}
        </Link>
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.started}>
        <Timestamp
          timestamp={typeof obj.status?.startTime === 'string' ? obj.status?.startTime : ''}
        />
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.vulnerabilities}>
        <ScanStatus scanResults={obj.scanResults} />
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.duration}>
        {status !== 'Pending'
          ? calculateDuration(
              typeof obj.status?.startTime === 'string' ? obj.status?.startTime : '',
              typeof obj.status?.completionTime === 'string' ? obj.status?.completionTime : '',
            )
          : '-'}
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.status}>
        <StatusIconWithText status={status} />
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.type}>
        {capitalize(obj.metadata?.labels[PipelineRunLabel.PIPELINE_TYPE])}
      </TableData>
      <TableData className={pipelineRunTableColumnClasses.component}>
        {obj.metadata?.labels[PipelineRunLabel.COMPONENT] ? (
          obj.metadata?.labels[PipelineRunLabel.APPLICATION] ? (
            <Link
              to={`/application-pipeline/workspaces/${workspace}/applications/${
                obj.metadata?.labels[PipelineRunLabel.APPLICATION]
              }/components`}
            >
              {obj.metadata?.labels[PipelineRunLabel.COMPONENT]}
            </Link>
          ) : (
            obj.metadata?.labels[PipelineRunLabel.COMPONENT]
          )
        ) : (
          '-'
        )}
      </TableData>
      <TableData data-testid="plr-list-row-kebab" className={pipelineRunTableColumnClasses.kebab}>
        <ActionMenu actions={actions} />
      </TableData>
    </>
  );
};

export default PipelineListRow;
