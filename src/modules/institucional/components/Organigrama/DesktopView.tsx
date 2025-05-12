import { Building2, Briefcase } from "lucide-react";
import { Tree, TreeNode } from "react-organizational-chart";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MemberInfo } from "../MemberDetails";
import { NodeContent } from "../NodeContent";

interface OrganizationChartProps {
  members: MemberInfo[];
  onViewDetails: (member: MemberInfo) => void;
}
interface GroupHeaderProps {
  title: string;
  icon: React.ReactNode;
}

export const OrganizationChart = ({
  members,
  onViewDetails,
}: OrganizationChartProps) => {
  // Filter members by position
  const presidente = members.find((m) => m.position === "Presidente");
  const secretaria = members.find((m) => m.position === "Secretaria General");
  const vocalesEstatales = members.filter((m) => m.department === "Estatal");
  const vocalesGremiales = members.filter((m) => m.department === "Gremial");

  return (
    <div className="w-full h-full overflow-hidden bg-gradient-to-br from-green-50 via-slate-50 to-white rounded-xl shadow-lg border border-gray-200 p-1">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={2}
        wheel={{ disabled: false }}
        pinch={{ disabled: false }}
        doubleClick={{ mode: "reset" }}
        smooth={true}
      >
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!w-full !h-full"
        >
          <div className="flex items-center justify-center w-full h-full p-6 sm:p-8 min-w-[800px]">
            {presidente && (
              <Tree
                lineWidth="2px"
                lineColor="#4CAF50" // Verde más vibrante y consistente
                lineBorderRadius="10px"
                nodePadding="16px"
                label={
                  <NodeContent
                    member={presidente}
                    isPresident={true}
                    onViewDetails={onViewDetails}
                  />
                }
              >
                <TreeNode label="">
                  {/* Secretaria General */}
                  <TreeNode
                    label={
                      <GroupHeader
                        title="Secretaría General"
                        icon={<Briefcase size={16} color="white" />}
                      />
                    }
                  >
                    {secretaria && (
                      <TreeNode
                        key={secretaria.id}
                        label={
                          <NodeContent
                            member={secretaria}
                            onViewDetails={onViewDetails}
                          />
                        }
                      />
                    )}
                  </TreeNode>

                  <TreeNode
                    label={
                      <GroupHeader
                        title="Vocales Estatales"
                        icon={<Building2 size={16} color="white" />}
                      />
                    }
                  >
                    {vocalesEstatales.map((vocal) => (
                      <TreeNode
                        key={vocal.id}
                        label={
                          <NodeContent
                            member={vocal}
                            onViewDetails={onViewDetails}
                          />
                        }
                      />
                    ))}
                  </TreeNode>

                  <TreeNode
                    label={
                      <GroupHeader
                        title="Vocales Gremiales"
                        icon={<Briefcase size={16} color="white" />}
                      />
                    }
                  >
                    {vocalesGremiales.map((vocal) => (
                      <TreeNode
                        key={vocal.id}
                        label={
                          <NodeContent
                            member={vocal}
                            onViewDetails={onViewDetails}
                          />
                        }
                      />
                    ))}
                  </TreeNode>
                </TreeNode>
              </Tree>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

const GroupHeader = ({ title, icon }: GroupHeaderProps) => (
  <div className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md shadow-md mb-3 w-40 sm:w-44 max-w-full mx-auto flex items-center justify-center gap-2 transform transition-all hover:shadow-lg hover:scale-105">
    {icon}
    <h4 className="font-medium text-center text-xs sm:text-sm tracking-wide">
      {title}
    </h4>
  </div>
);
