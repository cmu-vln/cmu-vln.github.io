#!/usr/bin/env python3
"""
批量重命名视频文件 - 移除 go2 footage 文件的 go2_ 前缀

功能：
- 递归扫描当前目录及子目录
- 查找包含 footage 且以 go2_ 开头的视频文件
- 重命名文件，移除开头的 go2_ 前缀
- 支持预览模式（dry-run）

作者：haokun_ros
日期：2026-01-19
"""

import argparse
from pathlib import Path


def rename_remove_go2_prefix(root_dir=".", dry_run=True, file_types=None):
    """
    重命名视频文件，移除 go2 footage 文件的 go2_ 前缀

    Args:
        root_dir: 根目录（默认当前目录）
        dry_run: 预览模式，只显示不执行（默认True）
        file_types: 文件类型列表（默认支持常见视频格式）
    """
    if file_types is None:
        file_types = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv']

    root_path = Path(root_dir).resolve()

    print(f"\n{'='*80}")
    print(f"批量重命名工具 - 移除 go2_ 前缀（统一命名规则）")
    print(f"{'='*80}")
    print(f"扫描目录: {root_path}")
    print(f"文件类型: {', '.join(file_types)}")
    print(f"模式: {'预览模式（不执行）' if dry_run else '执行模式（实际重命名）'}")
    print(f"{'='*80}\n")

    if not root_path.exists():
        print(f"错误: 目录不存在: {root_dir}")
        return

    # 查找所有包含 footage 且以 go2_ 开头的视频文件
    files_to_rename = []
    for file_type in file_types:
        for file_path in root_path.rglob(f"*footage*{file_type}"):
            if file_path.is_file() and file_path.name.startswith("go2_"):
                files_to_rename.append(file_path)

    if not files_to_rename:
        print("未找到包含 footage 且以 go2_ 开头的视频文件")
        return

    print(f"找到 {len(files_to_rename)} 个文件需要重命名:\n")

    renamed_count = 0
    error_count = 0

    for i, old_path in enumerate(files_to_rename, 1):
        # 生成新文件名（移除开头的 go2_）
        old_name = old_path.name
        if old_name.startswith("go2_"):
            new_name = old_name[4:]  # 移除前4个字符 "go2_"
            new_path = old_path.parent / new_name
        else:
            # 安全检查，理论上不应该到这里
            continue

        # 显示相对路径
        try:
            old_rel = old_path.relative_to(root_path)
            new_rel = new_path.relative_to(root_path)
        except ValueError:
            old_rel = old_path
            new_rel = new_path

        print(f"[{i}/{len(files_to_rename)}]")
        print(f"  原文件: {old_rel}")
        print(f"  新文件: {new_rel}")

        # 检查目标文件是否已存在
        if new_path.exists():
            print(f"  ⚠️  警告: 目标文件已存在，跳过")
            error_count += 1
            print()
            continue

        if not dry_run:
            try:
                old_path.rename(new_path)
                print(f"  ✓ 重命名成功")
                renamed_count += 1
            except Exception as e:
                print(f"  ✗ 重命名失败: {e}")
                error_count += 1
        else:
            print(f"  → 预览模式（未执行）")
            renamed_count += 1

        print()

    # 总结
    print(f"{'='*80}")
    print(f"重命名完成")
    print(f"{'='*80}")
    print(f"找到文件: {len(files_to_rename)} 个")
    if dry_run:
        print(f"预览模式: {renamed_count} 个文件将被重命名")
        print(f"跳过文件: {error_count} 个（目标已存在）")
        print(f"\n提示: 使用 --execute 参数执行实际重命名")
    else:
        print(f"成功重命名: {renamed_count} 个")
        print(f"失败/跳过: {error_count} 个")
    print(f"{'='*80}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='批量重命名包含 footage 的视频文件，移除开头的 go2_ 前缀（统一命名规则）',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 预览模式：查看将要重命名的文件（默认，不执行）
  python3 rename_remove_go2_prefix.py

  # 预览指定目录
  python3 rename_remove_go2_prefix.py --dir ./static/videos_vp9/go2

  # 执行实际重命名
  python3 rename_remove_go2_prefix.py --execute

  # 在指定目录执行重命名
  python3 rename_remove_go2_prefix.py --dir ./static/videos_vp9/go2 --execute

  # 同时处理 videos_vp9 和 videos_vp9_compressed
  python3 rename_remove_go2_prefix.py --dir ./static/videos_vp9/go2 --execute
  python3 rename_remove_go2_prefix.py --dir ./static/videos_vp9_compressed/go2 --execute

注意事项:
  - 默认为预览模式，不会实际修改文件
  - 使用 --execute 参数才会执行实际重命名
  - 只处理文件名中包含 footage 的文件
  - 只移除开头的 go2_ 前缀
  - 如果目标文件名已存在，会自动跳过
  - 支持递归处理所有子目录
  
示例:
  go2_frc_1th_coffee_1_footage_vp9.webm  →  frc_1th_coffee_1_footage_vp9.webm
  go2_gates_plant_1_footage_vp9.webm     →  gates_plant_1_footage_vp9.webm
        """
    )

    parser.add_argument(
        '--dir', '-d',
        type=str,
        default='.',
        help='要处理的目录（默认: 当前目录）'
    )

    parser.add_argument(
        '--execute', '-e',
        action='store_true',
        help='执行实际重命名（默认只预览）'
    )

    parser.add_argument(
        '--types', '-t',
        nargs='+',
        default=None,
        help='指定文件类型（例如: .webm .mp4）'
    )

    args = parser.parse_args()

    rename_remove_go2_prefix(
        root_dir=args.dir,
        dry_run=not args.execute,
        file_types=args.types
    )
